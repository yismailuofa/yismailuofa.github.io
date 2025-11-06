---
title: "Good Solutions Are Efficient"
description: "Why good solutions to hard problems should be efficient."
---

> If you're trying to solve a complicated problem as a designer
> […] I don't want to be wagging my tail in your face saying oh look what we solved it was very hard, but look what we did.
> I think that it should be, if the solution is clever, […] that it should just work.
>
> It should seem inevitable. It should seem obvious, as if there wasn't possibly another rational solution to to to the problem.
>
> I wish it would be some intrinsic fanfare and trumpeting, but my experience consistently suggests to me that you'll look at something and think,
> well yeah of course you'd do it that way; Why did it take so long?
>
> <cite>Jony Ive - A Conversation with Sam and Jony (2025)</cite>

Too often we try to solve problems with complex solutions. One might argue that a complicated problem warrants a solution that is just as complicated. Yet is this really true in practice?

Do we really need to provide something that is 100% accurate? Or can we tolerate an accuracy of 99% or less [^1]?

Do we really need an elegant set of interfaces to our service? Or would simple methods get the job done clearly?

Do we really need to optimize our O(n<sup>2</sup>) algorithm to be faster? Or does it perform well enough for our workloads?

Part of this stems from a desire to develop a perfect solution, and a tendency towards premature optimizations. But rather than solving a problem based on what the *best* solution is, what if we focused on the most **efficient** solution.

An efficient solution is one that solves its problem, while minimizing the effort expended to solve it. Focussing on efficiency not only creates elegant and obvious solutions, but also concise ones since complicated solutions tend to be long winded and harder to implement. And a short solution is far easier to understand and reason about than a longer one.

This is particularly true in software engineering, where lines of code are easily added. But this doesn't come without a cost. Every line of code added to a project is a liability. One that puts a burden on the next engineer who needs to understand its intent, reason about its logic, and make modifications to it.

Now I'm not suggesting we optimize for the shortest solutions possible and let our code become illegible one liners. And similarly we shouldn't allow half-baked solutions that barely get the job done in the spirit of having a simple solution. Rather we should strike a balance between a solution that is correct, not too verbose, and clear to understand; All while being careful to not eagerly over optimize.

Again, this methodology does not fit ever circumstance. I'm sure aerospace engineers would have you convinced that an imperfect solution is not really an option in their line of work. In fact, the in-elegance of having redundancies is just a fact of life when millions of dollars (and human lives) [^2] are at stake. Yet I'm sure if we developed software with this framework, we'd have solutions that are not only more attuned to their problems but easier to maintain in the long term.

---

[^1]: See [HyperLogLog](https://en.wikipedia.org/wiki/HyperLogLog) for a good example of this
[^2]: Not necessarily in that order