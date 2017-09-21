# Mediatool interview exercise

Welcome to the Mediatool exercise preparing for your on site interview. In this repository you will find an initial react app that is
set up with transpilers and livereload so that you won't need to focus on such things.

Below you will find instructions for how to run the app and the exercise itself. Good luck!

## Working with the application

After cloning this repo, install all dependencies using `yarn` or `npm`. When that is complete, run the server by executing `yarn demo` or `npm run demo`.
You will now be able to access the initial application through your browser at `http://localhost:3000`.

In the folder `lib` you will find an file called `index.jsx` that is the main file for your application. You can import other files from there.
You will also find the file `style.less` which is the base for styling. There are no requirements on a nice look and feel for this exercise but if
you do feel that you want to add some css or less, you can do that in this file. Whenever you make changes to any of these files or imports form them, the application should update by itself.

## mt-ui
We have provided you with the dependency `mt-ui` that you may use to structure the graphic components of the app. It is not a requirement that you use it, just something
that might make it easier for you so that you can focus on code and not on the looks of the application. It contains a grid that is explained on the initial page.

## Exercise Instructions
At the links below you will find two lists, one of users and one of their scores in a game. Create a React app that displays a ranking list where each user is displayed only once with their highest score in descending order. If you click on a user, a separate list should be visible showing all their scores in descending order. The app should also have a form where you can enter new scores with the user's name and score. If the user name does not already exist, that name should be added to the list of users. New data does not need to be saved on reload.
