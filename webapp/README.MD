# How to run

1. ```first install python3```
- ```pip3 install django```
- ```pip3 install django-webpack-loader```
    > Need for django to load webpack
- ```npm install```
    > Install all js dependencies in package.json
- ```./node_modules/.bin/webpack --config webpack.config.js ```
    > This is build all the js dependencies stated in package.json into one single js file named main-[hash].js
- ```python3 manage.py runserver```

- ```rm assets/bundles/main-* ```
    > You might want to clear the old main-*.js
- ```./node_modules/.bin/webpack -p --config webpack.config.js```
    > -p will invoke production build, basically it uglify the javascript files and compress its size

# Super User => /admin

- username: goal
- password: goalcool

