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
| ChatGPT |                                                                       |                                                                     |                                 |
| Claude  |                                                                       |                                                                     |                                 |
| Grok    | Nice cartoonish illustrations. Basket ball net is connected to a poll | Basket balls travels like projectile from bottom-left to top right. | minor text glitch in both sides |

#### prompt 2 :

|         | UI  | Functionality | Bugs |
| ------- | --- | ------------- | ---- |
| Gemini  |     |               |      |
| ChatGPT |     |               |      |
| Claude  |     |               |      |
| Grok    |     |               |      |

#### prompt 3 :

|         | UI  | Functionality | Bugs |
| ------- | --- | ------------- | ---- |
| Gemini  |     |               |      |
| ChatGPT |     |               |      |
| Claude  | UI looks perfect. It gives this  Torque Assembly · Unit 04 as title and that animation's look's like real metel.wrench working clock wise. |        It's a torque assembly unit. that unit has wrench,nut,bolt.bolt is going up to down with thread.wrench is working nicely.       |    it has some bugs. first thing bolt is  always tighting  but when wrench is not tighting.  |
| Grok    | that's has no any titles to discribe what 's that.it has main three items . they are moving but they isn't interract.   |  I think it's nut shows red color,bolt shows gray colour, but that's not perview real metel.              | this code has many bugs. frist thing is that are not look properly.wrench is not working with bolt together.and the nut isn't going up and down properly  |

#### prompt 4 : 


Side view HTML/CSS/JS animation of a six-shot revolver firing all rounds
until empty: realistic cylinder rotation, hammer cock & release, crisp muzzle flash + brief
smoke, ejected brass casings that tumble out, subtle recoil and slide/backwards bob,
visible spent chambers, play 6 shots in sequence then stop.

|         | UI  | Functionality | Bugs |
| ------- | --- | ------------- | ---- |
| Gemini  |     |               |      |
| ChatGPT |     |               |      |
| Claude  |     |               |      |
| Grok    |The UI displays a simple animation of a revolver firing six times in sequence. The design appears basic and looks more like a primary or rough animation rather than a realistic gun model. Although the interface supports a mobile view, it is not very user-friendly. The revolver is not fully visible on the screen, which makes the animation less clear to the user.     |  The animation functions correctly and follows the intended firing sequence. The revolver fires six times in order, and the sequence works properly for all six shots. During each shot, a visible smoke effect appears. Overall, the basic functionality of the animation works as expected.            | In the interface is that the animation does not restart after the six shots are completed. The system should refresh or provide a restart option for the next round, but there is no button or control available to do this.     |
