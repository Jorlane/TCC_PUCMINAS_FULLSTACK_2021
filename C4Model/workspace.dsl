workspace {
    model {
        userAnynomous = person "Usuário Não Autenticado"
        userAuth = person "Usuário Autenticado"
        admin = person "Administrador"
        timer = softwareSystem "Agendador de processamento de rotina"
        googleAccountApi = softwareSystem "Google Account Api"
        facebookAccountApi = softwareSystem "Facebook Account Api"
        linkedinAccountApi = softwareSystem "Linkedin Account Api"
        emailService = softwareSystem "Email Service"

        enterprise blog {
            blogSystem = softwareSystem "Plataforma de blog" {

                webserver_app = container "Aplicação Web" "Servidor dos arquivos estáticos da aplicação" "NodeJS + Express"
                SPA = container "SPA" "Front end" "React" "shapeSPA"
                database = container "Base de dados Blog" "Armazena os dados" "MariaDB" "Database"
                
                API = container "API" "API de serviços backend" "NodeJS" {
                    DatabaseORM = component "Database ORM" "Acesso a dados" "ORM" 
                    LoginController = component "Login Controller" "Realiza a autenticação dos usuários."
                    UserController = component "User Controller" "Configuração do Perfil do usuário"
                    WriterController = component "Blog Controller" "Configuração e manuntenção do blog."
                    CategoryController = component "Category Controller" "Manutenção de Categoria" 
                    ArticleController = component "Article Controller" "Manutenção de artigos"
                    NotificationController = component "Notification Controller" "Gerenciamento de notificação"

                    DatabaseORM -> database "persiste dados" "ORM" "relationshipShape"
                    LoginController -> DatabaseORM "utiliza"
                    UserController -> DatabaseORM "utiliza"
                    WriterController -> DatabaseORM "utiliza"
                    CategoryController -> DatabaseORM "utiliza"
                    ArticleController -> DatabaseORM "utiliza"
                    NotificationController -> DatabaseORM "utiliza"
                    NotificationController -> emailService "utiliza"
                    UserController -> emailService "utiliza"

                    SPA -> LoginController "utiliza"
                    SPA -> UserController "utiliza"
                    SPA -> WriterController "utiliza"
                    SPA -> CategoryController "utiliza"
                    SPA -> ArticleController "utiliza"
                    SPA -> UserController "utiliza"
                }
                userAnynomous -> SPA "Utiliza"
                userAuth -> SPA "Utiliza""
                admin -> SPA "Utiliza"
                timer -> API "Agenda Execução de Rotina"
                loginController -> googleAccountApi "Autentica"
                loginController -> facebookAccountApi "Autentica"
                loginController -> linkedinAccountApi "Autentica"
                API -> emailService "Envia email"
                emailService -> userAuth "Envia email para"
            }
        }
        webserver_app -> SPA "serve" "HTTPS" "relationshipShape"
        SPA -> API "utiliza" "" "relationshipShape"
    }

    views {
        systemContext blogSystem "C4Model-Context" {
            include *
        }
        container blogSystem "C4-Container"  {
            include *
        }
        component API "C4-Component"  {
            include *
        }
        styles {
            element "External System" {
                background #dddddd
                color #000000
            }
            element "Database" {
                shape Cylinder
            }
            element "shapeSPA" {
                shape WebBrowser
            }
            relationship "relationshipShape" {
                thickness 2
                color #000000
            }
        }
        theme default
    }
}