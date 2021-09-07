library(dplyr)

meta <-
    list.files("meta", full.names = TRUE) %>%
    lapply(
        function(f) {
            sheets <- readxl::excel_sheets(f)
            smry_sheet <- sheets[grepl("summary", tolower(sheets))]
            readxl::read_excel(f, smry_sheet)
        }
    ) %>%
    bind_rows() %>%
    mutate(
        stringr::str_match(`IDI Table Name`, ".*\\[(.+)\\]\\.\\[(.+)\\]$")[,2:3] %>%
            magrittr::set_colnames(c("schema", "table_name")) %>%
            as_tibble(),
        variable_name = stringr::str_replace_all(`Field name`, "\\[?\\]?", "")
    ) %>%
    select(schema, table_name, variable_name, description = Description)
