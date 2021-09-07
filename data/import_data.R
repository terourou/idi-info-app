# raw_file <- "IDI_vars.txt"
# files <- list.files("raw", "varlist[0-9]+\\.xlsx", full.names = TRUE)

# all_table_data <- lapply(files,
#     function(file) {
#         data <- readxl::read_excel(file, progress = FALSE)
#         data <- dplyr::select(data, TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME, DATA_TYPE)
#         colnames(data) <- c("schema", "table_name", "variable_name", "variable_type")
#         data[[paste0("IDI", gsub(".+varlist|\\.xlsx", "", file))]] <- 1L
#         data
#     }
# )

# table_data <- all_table_data[[1L]]
# if (length(table_data) > 1L) {
#     for (i in 2:length(all_table_data)) {
#         table_data <- dplyr::full_join(
#             table_data,
#             all_table_data[[i]],
#             by = c("schema", "table_name", "variable_name", "variable_type")
#         )
#     }
# }

# table_data <- dplyr::left_join(
#     dplyr::rename(readr::read_csv("raw/refreshes.csv"), schema = table_schema, variable_name = column_name),
#     dplyr::select(table_data, "schema", "table_name", "variable_name", "variable_type"),
#     by = c("schema", "table_name", "variable_name")
# )

table_data <- dplyr::rename(
    readr::read_csv("raw/refreshes.csv"),
    schema = table_schema,
    variable_name = column_name
)
table_data <- dplyr::rename_with(
    table_data,
    function(x) gsub("ref", "IDI", x)
)

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
#delete_tables <- c("trace_xe_action_map", "trace_xe_event_map", "data_link", "dedup_mapping")
#table_data <- table_data[!table_data$table_name %in% delete_tables, ]

## Additional data - will be merged with table_data

data_collections <- readxl::read_excel("raw/schema_updated.xlsx")

#data_collections <- read.csv("collection_info.csv")
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
#data_collections <- data_collections[, c("Data.collection", "Agency", "schema")]
colnames(data_collections) <- c("collection", "agency", "schema")

table_data <- dplyr::left_join(
    table_data,
    data_collections,
    by = "schema"
)

## WARNINGS ABOUT MISSING COLLECTION INFO
zzz <- unique(dplyr::filter(table_data, is.na(agency))$schema)
if (length(zzz)) {
    warning("The following schema are missing: \n", paste(zzz, collapse = ", "))
}

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

## possible matches:
matches <- yaml::read_yaml("raw/matches.yaml")

# convert to pivot table ... ?
matches <- lapply(matches,
    function(match) {
        lapply(match$vars,
            function(vars) {
                expand.grid(table = match$table, var = vars, stringsAsFactors = FALSE)
            }
        )
    }
)
matches <- do.call(c, matches)

matches <- lapply(matches,
    function(match) {
        match <- lapply(seq_len(nrow(match)),
            function(i) {
                mi <- match[i,]
                row.names(mi) <- NULL
                mmi <- match[-i, ]
                row.names(mmi) <- NULL
                colnames(mmi) <- c("alt_table", "alt_var")
                m <- cbind(mi, mmi)
                m$alt_table <- ifelse(m$alt_table == m$table, "", m$alt_table)
                m$alt_var <- ifelse(m$alt_var == m$var, "", m$alt_var)
                m
            }
        )
        do.call(rbind, match)
    }
)
matches <- do.call(rbind, matches)
write.csv(matches, "../public/possible_matches.csv", quote = FALSE, row.names = FALSE)


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
write.csv(table_data, "../public/idi.csv", quote = TRUE, row.names = FALSE)
TABLE_DATA <- table_data
# ididata$serialize("../public/data.pb")

## Do the same with adhoc ...

table_data <- dplyr::rename(
    dplyr::select(
        readr::read_csv("raw/varlistAdhoc.csv"),
        "TABLE_SCHEMA", "TABLE_NAME", "COLUMN_NAME"
    ),
    schema = TABLE_SCHEMA,
    table_name = TABLE_NAME,
    variable_name = COLUMN_NAME
)
# table_data <- dplyr::rename_with(
#     table_data,
#     function(x) gsub("ref", "IDI", x)
# )
table_data <- tibble::as_tibble(lapply(table_data, na_to_zero))
table_data <- dplyr::left_join(
    table_data,
    data_collections,
    by = "schema"
)

## WARNINGS ABOUT MISSING COLLECTION INFO
zzz <- unique(dplyr::filter(table_data, is.na(agency))$schema)
if (length(zzz)) {
    warning("The following schema are missing: \n", paste(zzz, collapse = ", "))
}

table_data <- left_join(table_data, meta,
    by = c("schema", "table_name", "variable_name")
)

## Add id column
table_data <- dplyr::arrange(table_data, agency, collection, table_name, variable_name)
table_data <- cbind(id = seq_len(nrow(table_data)), table_data)

write.csv(table_data, "../public/adhoc.csv", quote = TRUE, row.names = FALSE)



## Write basic stats to file:
files <- list.files("raw", "varlist[^0-9].+\\.xlsx", full.names = TRUE)
stats <- sapply(files,
    function(f) {
        d <- readxl::read_excel(f, progress = FALSE)
        c(
            gsub("varlist|\\.xlsx", "", basename(f)),
            length(unique(d$TABLE_NAME)),
            nrow(d)
        )
    }
)

table_data <- TABLE_DATA
refreshes <- names(table_data)[grepl("^IDI", names(table_data))]
refresh_stats <- sapply(refreshes,
    function(r) {
        d <- table_data[table_data[[r]] == 1, ]
        r <- paste(sep = "-",
            substr(r, 4, 7),
            substr(r, 8, 9),
            substr(r, 10, 11)
        )
        c(
            paste(r, "refresh"),
            length(unique(d$table_name)),
            nrow(d)
        )
    }
)

stats <- rbind(t(refresh_stats), t(stats))
rownames(stats) <- NULL
colnames(stats) <- c("table", "tables", "variables")
write.csv(stats, "../public/idistats.csv", quote = FALSE, row.names = FALSE)
