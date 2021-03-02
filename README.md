# TinyApp

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly). The app allows users to sign in with a user name, email, and password. Bcrypt is used to hash passwords, and cookie-session is used to create login sessions. Logged in users can add, edit, and delete URLs, and non-logged in visitors can view all URLs on the site but cannot alter them.

## Final Product

!["TinyApp home page"](https://github.com/AngusJK/tinyapp/blob/main/docs/home-page.png?raw=true)
!["TinyApp URLs page"](https://github.com/AngusJK/tinyapp/blob/main/docs/urls-page.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.