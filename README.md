# ComSciSeat Frontend
Frontend computer laboratory table reservation web application for Computer Science students

## Related Repository
- Backend: https://github.com/buyyakhoo/QuickSciSeat_Backend

## Tech Stack
- TypeScript
- SvelteKit
- TailwindCSS
- DaisyUI

## User Manual
### Login Page
![Login Page](/readme_picture/Screenshot%20(310).png)

### Homepage
![Home Page](/readme_picture/Screenshot%20(301).png)

### Laboratory Page
- Before select time
![Laboratory Page 1](/readme_picture/Screenshot%20(302).png)
- View Class Schedule
![Laboratory Page 2](/readme_picture/Screenshot%20(303).png)
- After select time
![Laboratory Page 3](/readme_picture/Screenshot%20(304).png)
- Popup confirm reservation
![Laboratory Page 4](/readme_picture/Screenshot%20(305).png)
- After reserved
![Laboratory Page 5](/readme_picture/Screenshot%20(306).png)

### Reservation Page
- View Reservation List
![Reservation Page 1](/readme_picture/Screenshot%20(307).png)
- Popup confirm cancel reservation
![Reservation Page 2](/readme_picture/Screenshot%20(308).png)

### Profile Page
![Profile Page](/readme_picture/Screenshot%20(309).png)

### Admin Page
![Admin Page 1](/readme_picture/Screenshot%20(311).png)
![Admin Page 2](/readme_picture/Screenshot%20(312).png)
![Admin Page 3](/readme_picture/Screenshot%20(313).png)
![Admin Page 4](/readme_picture/Screenshot%20(314).png)
![Admin Page 5](/readme_picture/Screenshot%20(315).png)
![Admin Page 6](/readme_picture/Screenshot%20(316).png)

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
