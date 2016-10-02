# jsAppend
Fast dynamic dom creation using javascript


## How to use it

Using jsAppend is very simple. It's syntax looks like other javascript libraries like jQuery.



### Add the script in your page

First you need to insert jsAppend on your page.

You can add it on your page's head or body.

```html
<script src="jsappend-0.4.3.min.js"></script>
```


### jsAppend call

You can call jsAppend using the variables *$*, *jA* or *jsAppend*.

For example lets get the body element of the page.

```javascript
// Using the $
$("body");

// Using the jA
jA("body");

// Using the jsAppend
jsAppend("body"); 
```

If any of these variables is not availiable, jsAppend will not override them. So you can easily use use jsAppend with other libraries like jQuery etc.

```html
<script>
	// Variable $ is defined
	var $ = "something";
</script>

<!-- Load jsAppend -->
<script src="jsappend-0.4.3.min.js"></script>

<script>
	// Print $
	console.log($); // Output : "something"
</script> 
```


### jsAppend syntax

As you may already understund, the jsAppend syndax looks something like this :

```javascript
jA(selector).action();
```

We have 3 main selector types :
* `#id` the id selector
* `.classname` the class name selector
* `*tagname` the create element selector


##### Select by id

Lets select an element by it's id.

```html
<!-- A simple div with id -->
<div id="myDiv"></div>

<script>
	// Get div by it's id
	var myDiv = jA("#myDiv"); // jsAppend Element
	myDiv.element; // Html Element
</script> 
```


##### Select by class name

Lets select an element by it's class name.

```html
<!-- A simple div with class name -->
<div class="divGroup"></div>

<script>
	// Get the first div with this class name
	var aDiv = jA(".divGroup[0]"); // jsAppend Element
	// Get all of them
	var listOfDiv = jA(".divGroup"); // List of Html Element

	aDiv.element == listOfDiv[0]; // Returns true
</script> 
```


##### Create element

Lets create an element by tag name.

```html
<!-- A simple div with class name -->
<div id="aParent"></div>

<script>
	// Create a link
	var newA = jA("*a"); // jsAppend Element
	// Add a text on the link
	newA.text("click me");
	// Add a url link on the link
	newA.href("http://some.url/");
	// Insert it inside the div
	newA.appendTo("#aParent");
</script> 
```