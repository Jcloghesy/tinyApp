# TinyApp Project


## INTRODUCTION

TinyApp is a full stack web application

* built with [`Node`][node] and [`Express`][express],
* allows users to shorten long URLs, similar to the website [`bit.ly`][bit.ly])


## USAGE

***Dependencies***

  * [`Node.js`][node]
  * [`Express`][express]
  * [`EJS`][ejs]
  * [`bcrypt`][bcrypt]
  * [`body-parser`][bparser]
  * [`cookie-session`][cookie-session]

***Install Application***

  * Install application and all dependencies
  
```bash
  npm install @jcloghesy/tinyApp
```

***Run Application***

* Run application by starting web server

```bash
  node express_server.js
```

## APPLICATION SCREENS

***Login Page***
![User Login Page][Login ]

***Logout Page***
![User Logout Page][Logout ]

***User Registeration***
![User Registration Page][register]

***URLs - Main (View/Select)***
![Main URL Page - View][urls_index]

***URLs - Create New***
![URLS - Create New][urls_new]

***URLs - Edit***
![URLS - Create Edit][urls_show]

## ADDITIONAL INFORMATION

  ***Background***
  * TinyApp is a project was built for learning purpose and represents a relatively small aspect of the curriculum (fullstack development) students are required to complete while enrolled in [Lighthouse Labs' - Web Development Program][Lighthouse Labs - Web Development Program]

 ***Warning / Disclaimer***
  * `BEWARE:`  This project was built as a *proof of concept* for learning purpose and therefore This application is not intended for use in production-grade environment

  ***Author***

  * This application was created and published by [@JCloghesy](https://github.com/Jcloghesy)

## DOCUMENT TREE 

```text
│
├─── docs
│   ├─── login.PNG
│   ├─── logout.PNG
│   ├─── register.PNG
│   ├─── urls_index.png
│   ├─── urls_new.png
│   └─── urls_show.png
│
├─── node_modules
│   ├─── ...
│   ...
│
├─── test
│    └─── helpersTest.js
├─── views
│   ├─── partials
│   │   ├─── _header.ejs
│   │ 
│   ├─── home.ejs
│   ├─── login.ejs
│   ├─── logout.ejs
│   ├─── register.ejs
│   ├─── urls_index.ejs
│   ├─── urls_new.ejs
│   └─── urls_show.ejs
│   
├─── .gitignore
├─── express_server.js
├─── helpers.js
├─── package-lock.json
├─── package.json
└─── README.md
```


<!-- REFERENCE LINKS -->

<!-- Dependencies -->
[node]: https://github.com/nodejs/node
[express]: https://github.com/expressjs/express
[ejs]: https://www.npmjs.com/package/ejs
[bcrypt]: https://www.npmjs.com/package/bcrypt
[bparser]: https://www.npmjs.com/package/body-parser
[cookie-session]: https://www.npmjs.com/package/cookie-session
<!-- [cparser]: https://www.npmjs.com/package/cookie-parser -->


<!-- Images - Screen Captures & Logos, etc  -->
[login]: /docs/login.png
[logout]: /docs/logout.png
[register]: /docs/register.png
[urls_index]: /docs/urls_index.png
[urls_new]: /docs/urls_new.png
[urls_show]: /docs/urls_show.png


<!-- Additional Website Links -->
[bit.ly]: https://bitly.com/
[Lighthouse Labs - Web Development Program]: https://www.lighthouselabs.ca/en/web-development
