#pragma strict

// Controls
var Touch : ClassTouch;

function Start()
{

}

function Update()
{
	if ( Input.GetMouseButtonDown(0) )
	{ Touch.center = Input.mousePosition; }
	else if ( Input.GetMouseButton(0) )
	{		
		// Touch functionality
		if (Vector2.Distance(Touch.offset,Touch.center) > 10)
		{ Touch.offset = ((Input.mousePosition - Touch.center)).normalized; }
		if (Vector2.Distance(Input.mousePosition,Touch.center) > Touch.range)
		{ Touch.center = Input.mousePosition+Touch.offset*-Touch.range; }
	}
	else
	{
		Touch.offset -= (Touch.offset).normalized*Mathf.Min(Time.deltaTime,Touch.offset.magnitude);
	}
	
	transform.position += Vector3(Touch.offset.x,Touch.offset.y,0)*10*Time.deltaTime;
	
	if (transform.position.x < -15)
	{ transform.position.x = -15; }
	if (transform.position.x > 15)
	{ transform.position.x = 15; }
	if (transform.position.y < 2)
	{ transform.position.y = 2; }
	if (transform.position.y > 30)
	{ transform.position.y = 30; }
}