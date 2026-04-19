# Create versus Consume

> A minimal tracker that shows whether your time is spent creating or consuming — in real time.

## Why I built it

I kept losing hours scrolling and consuming content without realising how much time was actually going into it. Consuming is fine but it's easy to forget that creating matters too. Writing, building, recording — these things get pushed aside when the whole world is competing for your attention. I built this simple tracker to make the invisible visible. I wanted to see where my time actually goes.

## Preview

![App screenshot](screenshot.png)

## Features

- Toggle between Creating and Consuming mode before starting or while the timer is working
- Timer with play, pause, and stop controls
- Each stopped session saves automatically as an entry
- Ratio bar showing the visual split between creating and consuming time
- Text feedback that tells you exactly how your time is distributed
- Edit or delete any entry
- All data persists after page refresh

## Tech Stack

HTML, Tailwind CSS, vanilla JavaScript

## What I learned

- **localStorage** — saving and loading arrays of objects so data persists between sessions
- **DOM manipulation** — building and updating elements dynamically from data instead of hardcoding HTML
- **State management** — tracking app state with variables like `isRunning`, `modeStatus`, and `currentEdit` and keeping the UI in sync
- **Array methods** — using `filter` and `reduce` together to calculate totals from a dataset
- **Event handling** — managing click events, input validation, and modal interactions

## Live Demo

[View it here]([your-link-here](https://create-v-consume.vercel.app/))
