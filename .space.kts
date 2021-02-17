/**
* JetBrains Space Automation
* This Kotlin-script file lets you automate build activities
* For more info, see https://www.jetbrains.com/help/space/automation.html
*/

job("AlgoPuni") {
    container("node:alpine") {
        shellScript {
            interpreter = "/bin/sh"
            content = """
                echo Install npm dependencies...
                npm install
                echo Run tests...
                npm run test
            """
        }
    }
}
