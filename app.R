library(DBI)
con <- dbConnect(duckdb::duckdb(), "data/idi-info.db", read_only = TRUE)

get_table <- function(con, param) {
    dbGetQuery(con,
        glue::glue("SELECT * FROM idi_vars WHERE variable_name LIKE '%{param}%'")
    )
}

library(shiny)

ui <- fluidPage(
    textInput("param", "Search term:"),
    tableOutput("table")
)

server <- function(input, output, session) {
    dataset <- reactive({
        get_table(con, input$param)
    })

    output$table <- renderTable({
        dataset()
    })
}

shinyApp(ui, server)
