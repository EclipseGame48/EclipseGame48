var debris : Transform;
var model : Transform;
var getSound : AudioClip;

var range = 2.0;
var speed = 50.0;
var rotate = true;
private var time : float;

function Start()
{
	time = Random.value*360;
}

function LateUpdate()
{
	time += speed*Time.deltaTime;
	if (time > 360)
	{ time = 0.0; }
	
	model.localPosition.y = Mathf.Sin(time*Mathf.PI/180)*range;
	model.localEulerAngles.y = time;
}

function Die()
{
	Instantiate(debris, model.position, model.rotation);
	Destroy(gameObject);
}