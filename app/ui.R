library(shiny)

shinyUI(
    fluidPage(
        textInput("param", "Search term:"),
        tableOutput("table")
    )
)
