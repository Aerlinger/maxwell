npm install jam 
---

JAM it together like `this`:

    jam(function() { doYourThing(); this(); })
      (function() { doOtherThingWithCallback(this); })
      (function() { doOtherThingWithCallbackArgs(this); })
      (function(result) { doNodeJsStuff(this); })
      (function(err, result) { setTimeout(this, 3000); })
      (function() { /* yay! we're done! */ });

That is, the `this` object is the next function to be called.
Use `this` when you would normally pass a callback. 

You can even nest `JAM`s inside each other:

    jam(function() { jam(function() { jam(function() { ....

And the JAM chain would still execute correctly :)

And oh, you know what? You can even pass JAMs around!
Try the `test-passing.js` example to see what I mean :)

WHY ?
-----

Short answer: Because none of the existing ones are simple enough for my taste.

Yeah, I know there're tons of other continuation helpers out there already
but there really isn't one where you could quickly just type-in the list
of stuff to do and be done with it without worrying about forgetting to
close the list with a parenthesis or forgetting to add a comma. And yeah,
IMO it is wayyy easier to just add a `(function() { })` block at the end
because that's what you're usually doing all the time anyway taking care
of all those JS variable scopes. And it is easier to copy/paste/reorder
as well.

Another thing is that, most of them isn't very monadic. Yes, you *can*
chain them. But then you can't pass those chains around or dynamically
modify them except maybe using a few `arguments` trick/utils to help you.
That has limited my ability to program and think somewhat especially
since you should be thinking a lot about asynchronous-ness and continuations
when working on node.js (that's the whole point of the platform, ain't it?)

So I decided, WTH, I could just write one.  

And you gotta admit, writing all these stuff is just god damned *fun*! XD
