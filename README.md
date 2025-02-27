# Derek-JSpong

Code-along practice with Derek Banas's video [Game Design Tutorial](https://www.youtube.com/watch?v=rex2_9YBKAE). This is a simple pong game against the "AI" programmed with JavaScript.

Changes I made:
- Reorganized code in functions and regions.
- Added some global variables to set things like height and width of the canvas.
- A function was generalized to avoid repetition.
- Added option for AI vs AI game.

What determines the AI vs AI mode is a global variable called isAIvsAI. If set to true (default), as soon as you move your paddle (with either W, S, ↑ or ↓), the player's paddle will play by itself.

Just open the .html file on your browser to play it.

## Screenshot
![image](https://github.com/user-attachments/assets/a4c14a56-e50f-44d7-9d47-cf2c13f7c405)

Ha! Take that, ChatGPT!

## Oddity
For some reason, the colission sound is only turned on when pressing W or S to move the paddle.
