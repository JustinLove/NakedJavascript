*Naked Objects* create applications without custom coded GUIs.  The one interface is directly listing the members of an object; values can be modified, references followed, and methods executed.

*Naked Javascript* is barely a proof of concept at this point; It can edit simple values and display but not execute functions.

The look and feel is vastly improved by using [jQuery.UI](<http://ui.jquery.com/), albeit in beta (I did make one small patch, which appears to be fixed in the upcoming code base.)  I also did some source-code formatting with [Chili](http://noteslog.com/chili/).

Function editing will probably be a long shot.  It will probably happen only in very restrained circumstances if at all - I don't know of any way to get at the previous function's scope of definition, so you won't necessarily have access to it's variables.

Simple strings and numbers can be [edited in-place](http://davehauenstein.com/blog/archives/28).  The changes will affect the object, with a couple of caveats.  First, related fields in i.e., DOM objects won't update; you can close and re-open a browser if necessary.  All changes are transient; I haven't even looked at how saving might work when running on a local filesystem.  Most of the things that can be done now are toys, but I do have one pointer to a text element on the page, which can be updated.
 
### Limitations and Bugs

* Only declared function arguments can be supplied
* Modified state can't be saved
* IE: function pretty-printing
* IE: edit in-place doesn't seem to be calling call-backs
* IE error on hasOwnProperty
* DontEnum properies aren't shown
* It remains to be seen if functions can be edited

