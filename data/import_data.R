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

table_data <- cbind(id = seq_len(nrow(table_data)), table_data)
write.csv(table_data, "../public/data.csv", quote = FALSE, row.names = FALSE)
