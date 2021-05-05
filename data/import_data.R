# raw_file <- "IDI_vars.txt"
files <- list.files("raw", "varlist[0-9]+\\.xlsx", full.names = TRUE)

all_table_data <- lapply(files,
    function(file) {
        data <- readxl::read_excel(file, progress = FALSE)
        data <- dplyr::select(data, TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME, DATA_TYPE)
        colnames(data) <- c("schema", "table_name", "variable_name", "variable_type")
        data[[paste0("IDI", gsub(".+varlist|\\.xlsx", "", file))]] <- 1L
        data
    }
)

table_data <- all_table_data[[1L]]
if (length(table_data) > 1L) {
    for (i in 2:length(all_table_data)) {
        table_data <- dplyr::full_join(
            table_data,
            all_table_data[[i]],
            by = c("schema", "table_name", "variable_name", "variable_type")
        )
    }
}

# replace NAs with 0
na_to_zero <- function(x) ifelse(is.na(x), 0, x)
table_data <- tibble::as_tibble(lapply(table_data, na_to_zero))

# raw_data <- readLines(raw_file)

# split into tables
# table_rows <- grep("DataSource:", raw_data)
# table_rows_end <- c(table_rows[-1] - 1, length(raw_data))

# table_data <- lapply(seq_along(table_rows),
#     function(i) {
#         data <- raw_data[table_rows[i]:table_rows_end[i]][-1]
#         name_row <- grep("Table: ", data)
#         name <- gsub(".*Table:[ ]+", "", data[name_row])
#         results <- data[grepl("result:", data)]
#         results <- stringr::str_match(results, "\\{result:(.+)\\}[ ]+([a-z]+)")[,2:3]
#         colnames(results) <- c("variable_name", "variable_type")
#         as.data.frame(cbind(table_name = name, results))
#     }
# )
# table_data <- do.call(rbind, table_data)

## Remove some unwanted tables:
delete_tables <- c("trace_xe_action_map", "trace_xe_event_map", "data_link", "dedup_mapping")
table_data <- table_data[!table_data$table_name %in% delete_tables, ]

## Additional data - will be merged with table_data
data_collections <- read.csv("collection_info.csv")
# data_rows <- apply(data_collections, 1,
#     function(x) {
#         if (!x["from"] %in% table_data$table_name) return(c(NA, NA))
#         start <- min(which(table_data$table_name == x["from"]))
#         if (x["to"] == "" || !x["to"] %in% table_data$table_name)
#             x["to"] <- x["from"]
#         end <- max(which(table_data$table_name == x["to"]))
#         c(start, end)
#     }
# )
# data_collections[, c("from", "to")] <- t(data_rows)
# data_collections <- data_collections[!is.na(data_collections$from), ]
data_collections <- data_collections[, c("Data.collection", "Agency", "schema")]
colnames(data_collections) <- c("collection", "agency", "schema")

table_data <- dplyr::left_join(
    table_data,
    data_collections,
    by = "schema"
)

# table_data <- do.call(
#     rbind,
#     lapply(seq_len(nrow(data_collections)),
#         function(i) {
#             r <- data_collections[i, , drop = FALSE]
#             cbind(
#                 agency = r$Agency,
#                 collection = r$Data.collection,
#                 schema = r$schema,
#                 table_data[r$from:r$to, ]
#             )
#         }
#     )
# )


## Read meta data and merge
source("read_metadata.R") # returns `meta`

table_data <- left_join(table_data, meta,
    by = c("schema", "table_name", "variable_name")
)

## Add id column
table_data <- dplyr::arrange(table_data, agency, collection, table_name, variable_name)
table_data <- cbind(id = seq_len(nrow(table_data)), table_data)

## Create Protobuf message:
# library(RProtoBuf)
# readProtoFiles("idi.proto")

# vars <- pbapply::pbapply(table_data, 1,
#     function(x) {
#         x <- as.list(x)
#         # x <- x[c("id", "schema", "table_name", "variable_name", "variable_type", "description")]
#         if (is.na(x$description)) x$description <- NULL
#         do.call(new, c(list(Class = IDI.Variable), x))
#     }
# )
# ididata <- new(IDI.VariableList, variables = vars)

## Write data to file:
write.csv(table_data, "../public/data.csv", quote = TRUE, row.names = FALSE)
# ididata$serialize("../public/data.pb")
