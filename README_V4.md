## UCSC Vibecoding - day 06

#### Comaparing responses of different ai models

---

#### Part 1

#### prompt 1 :

Generate a single file HTML document containing HTML, CSS, and
JavaScript that creates a clean, light-themed animation of a basketball arcing through
the air and falling accurately into a hoop, using simple CSS shapes or SVG for the ball,
rim, net, and backboard. Ensure the trajectory and physics feel realistic, the motion is
smooth, and the animation loops continuously with the ball properly entering the basket
each time.

|         | UI                                                                    | Functionality                                                       | Bugs                            |
| ------- | --------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------- |
| Gemini  |   light-gray "court" with a minimalist white backboard and a red rim. The basketball is orange and the frame of the basket is red.                                                               |  The ball follows a calculated gravity curve, while the net "wiggles" at the exact moment the ball passes through, creating a continuous, physics-like loop.                                                                   |             The ball dissappears after going throgh the hoop.                    |
| | ChatGPT |  The animation shows a clean light‑themed court with a customizable basketball whose color can be adjusted for visual variety   |     The ball follows a smooth parabolic trajectory into the hoop, with adjustable speed and launch angle to control how fast and high the arc looks          |  The ball’s path is fixed, it doesn’t spin, the rim and net don’t react, the reset is sudden, and resizing the window can break the layout.    |
| Claude  |  The animation shows a clean, light‑themed basketball hoop, backboard, and net with a simple orange ball.   | The ball follows a smooth parabolic arc, rises to a peak, and drops directly into the hoop in a continuous loop.              |  The ball does not spin, the net remains static, and the shot trajectory is fixed without variation    |
| Grok    | Nice cartoonish illustrations. Basket ball net is connected to a poll | Basket balls travels like projectile from bottom-left to top right. | minor text glitch in both sides |


#### prompt 2 :

|         | UI  | Functionality | Bugs |
| ------- | --- | ------------- | ---- |
| Gemini  |    a minimalist, dark themed engine block with a gray piston. It includes a live status indicator above the frame that color codes the current engine stroke blue for intake, orange for power, and gray for exhaust to visually represent the mechanical cycle. |   The piston moves up and down vertically.            |   There is no crankshaft. The piston just moves vertically within the chamber   |
| ChatGPT |  The animation shows a simple SVG cross‑section with a cylinder, piston, connecting rod, and crankshaft, plus color‑coded effects for each stroke.   |    The crankshaft rotates smoothly, driving the piston up and down with realistic linkage geometry, while the stroke phases change color to represent intake, compression, power, and exhaust.           |   The piston motion is simplified, the stroke colors are basic overlays without fluid detail, resizing may distort the layout, and the cycle resets abruptly without extra mechanical realism.   |
| Claude  | The engine animation shows a cross‑section of a cylinder with piston, connecting rod, and crankshaft, along with colored effects for each stroke.    |      The crankshaft rotates smoothly, driving the piston’s up‑down motion through realistic linkage geometry, while the cycle transitions through intake (blue), compression, power (orange/yellow), and exhaust (grey).         |   The stroke colors are simple overlays without detailed airflow or combustion visuals, the piston and rod shapes are basic, and the exhaust/intake effects remain static rather than animated dynamically.   |
| Grok    |     |               |      |

#### prompt 3 :
Create a single-file HTML/CSS/JS animation of a metal wrench tightening a hex nut on a threaded bolt.

|         | UI  | Functionality | Bugs |
| ------- | --- | ------------- | ---- |
| Gemini  |Has a sleek UI themed in dark blue. Has applied styles to the nut and wrench to make it look like metal. Has implemented working buttons to "start tightenning" and "Reset nut". Has added a footer with text "Mechanical Precision v1.0"|The initial placement of the nut and wrench is fine. When clicked on the "Start tightenning" button, it is expected to trigger the tightening animation. And reset the animation if clicked on the reset button|Upon clicking the start button, both the wrench and nut move out of the browser window. The nut can be seen, partially, rotating but not along the bolt thread. Reset button do work as intended though.|
| ChatGPT |Has a minimal UI design themed in grey color. No buttons have been added. The animation plays in the center upon loading the webpage |Expected to just smoothly play the animation when loaded and keep it playing indefinetely.|The placement and alignment of the objects are slightly off. The objects look plain and 2D|
| Claude  |     |               |      |
| Grok    |     |               |      |

#### prompt 4 :

|         | UI  | Functionality | Bugs |
| ------- | --- | ------------- | ---- |
| Gemini  |     |               |      |
| ChatGPT |     |               |      |
| Claude  |     |               |      |
| Grok    |     |                |      |

