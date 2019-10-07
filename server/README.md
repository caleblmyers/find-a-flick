# Pop Media

#### Developed by Caleb Myers

## Overview

Pop Media is an interactive site that allows users to browse popular media, discover something new, and keep track of their favorites. Movie, show, actor, and crew data is pulled from The Movie Database (TMDb) API and presented in a clean, user-friendly client. 

The navigation bar at the top of the screen displays the available pages:

* `Home`
* `Discover`
* `Search`
* `Account` (only if the user is logged in to an account)

Guest account information:

* User: `Guest`
* Password: `password`

## Pages

#### Home

The **Home** page is where the user first lands on the site. Here, the user may use the presented search bar right away or browse the provided lists of content. The image slider banners, as well as the entries in each table, are links to a page with more information on the subject.

![Pop Media Home Page](../images/home.png)

#### Details

The **Details** page displays various information on selected items. The provided information is determined by the item type (movie, show, or person).

![Pop Media Details Page](../images/details.png)

Movies and TV shows both display a list of cast members, as well as similar and recommended titles. Movies will show information about any collection the film belongs to, while TV shows will present an episode guide covering any available seasons.

Actor and crew pages display biographical information, as well as any titles the person worked on.

If the user is logged in to an account, a `Favorite` button appears on the page header, allowing the user to add the movie, show, or person to their list of favorites. In addition, at the bottom of the details page is a comment board. Logged in users may leave a comment on any page they like. Users may then edit or delete any of their comments.

#### Discover

The **Discover** page is designed to help users discover something new based on what they already like. The two buttons at the top labelled `Movies` and `TV Shows` determine the media type being searched for.

![Pop Media Discover Page](../images/discover.png)

For each media type, a dropdown menu of search queries are provided to get the user started. Selecting any of these choices and pressing the `Discover` button will provide a list of items matching the query. 

![Pop Media Discover Queries](../images/queries.png)

For more advanced searches, select the checkbox labelled `Advanced`. This brings up a form where users can specify results by fields such as release time and vote counts. If the user is logged in, the dropdown menu labelled `With People` will fill with any actors the user has favorited.

![Pop Media Discover Form](../images/form.png)

#### Search

The **Search** page allows users to directly search for titles or people. Type in a term to search for in the input field, and press the `Search` button to bring up a list of matching results

![Pop Media Search Page](../images/search.png)

#### Accounts

New users may use the **Register** and **Login** pages, available on the navigation bar, to create an account.

If the user is logged in to an account, a link to the **Account** page also appears on the navigation bar. This page displays relevant information about the currently logged in user's account, including a list of favorites and comments. The user may change their account name to another available name, or delete their account here.

![Pop Media Account Page](../images/account.png)

## Details

Pop Media is designed, developed, and maintained by Caleb Myers -- https://github.com/caleblmyers

This app is built with a **SERN** stack -- MySQL, Express.js, React.js, and Node.js

The site is hosted on **Heroku** -- https://pop-media.herokuapp.com/

All movie, tv show, and person data is provided by The Movie Database -- https://www.themoviedb.org