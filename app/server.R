library(DBI)
con <- dbConnect(duckdb::duckdb(), "idi-info.db", read_only = TRUE)

get_table <- function(con, param) {
    dbGetQuery(con,
        glue::glue("SELECT * FROM idi_vars WHERE variable_name LIKE '%{param}%'")
    )
}

library(shiny)

shinyServer(function(input, output, session) {
    dataset <- reactive({
        get_table(con, input$param)
    })

    output$table <- renderTable({
        dataset()
    })
})
