raw_file <- "IDI_vars.txt"

raw_data <- readLines(raw_file)

# split into tables
table_rows <- grep("DataSource:", raw_data)
table_rows_end <- c(table_rows[-1] - 1, length(raw_data))

table_data <- lapply(seq_along(table_rows),
    function(i) {
        data <- raw_data[table_rows[i]:table_rows_end[i]][-1]
        name_row <- grep("Table: ", data)
        name <- gsub(".*Table:[ ]+", "", data[name_row])
        results <- data[grepl("result:", data)]
        results <- stringr::str_match(results, "\\{result:(.+)\\}[ ]+([a-z]+)")[,2:3]
        colnames(results) <- c("variable_name", "variable_type")
        as.data.frame(cbind(table_name = name, results))
    }
)
table_data <- do.call(rbind, table_data)

## Remove some unwanted tables:
delete_tables <- c("trace_xe_action_map", "trace_xe_event_map", "data_link", "dedup_mapping")
table_data <- table_data[!table_data$table_name %in% delete_tables, ]

## Additional data - will be merged with table_data
data_collections <- read.csv("collection_info.csv")
data_rows <- apply(data_collections, 1,
    function(x) {
        if (!x["from"] %in% table_data$table_name) return(c(NA, NA))
        start <- min(which(table_data$table_name == x["from"]))
        if (x["to"] == "" || !x["to"] %in% table_data$table_name)
            x["to"] <- x["from"]
        end <- max(which(table_data$table_name == x["to"]))
        c(start, end)
    }
)
data_collections[, c("from", "to")] <- t(data_rows)
data_collections <- data_collections[!is.na(data_collections$from), ]

table_data <- do.call(
    rbind,
    lapply(seq_len(nrow(data_collections)),
        function(i) {
            r <- data_collections[i, , drop = FALSE]
            cbind(
                agency = r$Agency,
                collection = r$Data.collection,
                schema = r$schema,
                table_data[r$from:r$to, ]
            )
        }
    )
)


## Write data to file:
table_data <- cbind(id = seq_len(nrow(table_data)), table_data)
write.csv(table_data, "../public/data.csv", quote = FALSE, row.names = FALSE)
