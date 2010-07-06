# BrainBranch

## Description
Helps to remember your work tasks by not getting lost in the recursion 
maze.

Right now, it is just some kind of a todo list.

Later, this work should act sort of like Git for files but for your and your 
co-workers brain. You will branch off current ideas and projects and will be
able to find reoccurring patterns between users.

## Technical Details
This is basically a Read-Evaluate-Parse-Loop 
([REPL](http://en.wikipedia.org/wiki/Read-eval-print_loop)) written in 
Javascript using [NodeJS](http://nodejs.org/).
It shows a stack where you can push current work tasks or thoughts on it. 
When you are done, you can either pop from the top or even from within. 
But remember that you cannot push within the stack, as this would mess up 
natural time.

Persistent storage at the moment is done using a simple text file to dump
an array as JSON. I do not expect big data structures or fast I/O handling. 
This keeps the project small and dependency-less.

## Credits
Thanks to [Ryan Dahl](git://github.com/ry) for [NodeJS](http://nodejs.org/).
Thanks to [ASCII-Art](http://www.ascii-art.de/ascii/pqr/pinky+brain.txt) for the easter egg. 

## Usage
    $ ./bb.js
    freetime!
    bb> help
     mind ITEM, +ITEM        Push ITEM onto stack
     drop [INDEX], -[INDEX]  Pop an item with INDEX from stack
     help                    Show this help screen
     exit                    Exit the program
    bb> mind Checkout papers
    
    | Checkout papers | 1
    +-----------------+
    bb> +Extend Readme
    
    | Extend Readme   | 1
    | Checkout papers | 2
    +-----------------+
    bb> drop
    
    | Checkout papers | 1
    +-----------------+
    bb> exit
    quitting...
    $ 

## Requirements
* [NodeJS](http://nodejs.org/) (~v0.1.100)
* [colors.js](http://github.com/Marak/colors.js) (included in the repository)
