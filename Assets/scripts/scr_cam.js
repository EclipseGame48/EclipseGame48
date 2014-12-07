#pragma strict

var gameSys : Transform;
var target : Transform;

var texTouch : Texture2D;
var texTouchRange : Texture2D;

var texPause : Texture2D;

var levelBrowser : boolean;

var axes : Vector3;

var offset = Vector3(0,5,-8);
private var fps : float;

var touchPos : Vector2;
var TouchRange : float;

var position : Vector3;

var uiStyle : GUIStyle;

function Start()
{
	position = transform.position;
	if (!levelBrowser)
	{ TouchRange = target.GetComponent(scr_player).Touch.range; }
	if (levelBrowser)
	{
		TouchRange = target.GetComponent(scr_browserTarget).Touch.range;
		offset = Vector3(0,1,-20);
		transform.eulerAngles.x = 0;
	}

	findGameSys();
}

function Update()
{
	// Debug stuff
	if ( Time.timeScale != 0 )
	{
		if (Input.GetKeyDown("r"))
		{ Application.LoadLevel(Application.loadedLevelName); }
			
		if (Input.GetKey("x")) // Slow motion!
		{ Time.timeScale = 0.2; }
		else
		{ Time.timeScale = 1; }
	}
			
	// Camera movement
	position = Vector3.Lerp(position,Vector3(target.position.x*axes.x,target.position.y*axes.y,target.position.z*axes.z)+offset,10*Time.deltaTime);
	
	transform.position = position;
	
	var delta = Time.smoothDeltaTime;
	if (delta != 0.0)
	{ fps = 1 / delta; }
}

function OnGUI()
{
	if (GUI.Button(Rect(Screen.width-128,0,128,128),texPause,uiStyle))
	{
		
	}

	if (Input.GetMouseButton(0))
	{
		if (!levelBrowser)
		{ touchPos = target.GetComponent(scr_player).Touch.center; }
		else
		{ touchPos = target.GetComponent(scr_browserTarget).Touch.center; }
		
		GUI.DrawTexture(Rect(touchPos.x-TouchRange,Screen.height-touchPos.y-TouchRange,TouchRange*2,TouchRange*2), texTouchRange);
		GUI.DrawTexture(Rect(Input.mousePosition.x-TouchRange*0.5,Screen.height-Input.mousePosition.y-TouchRange*0.5,TouchRange,TouchRange), texTouch);
	}
	
	GUI.Label(Rect(0, 0, Screen.width, 30), fps.ToString ("#,##0 fps"));
}

function findGameSys()
{ gameSys = GameObject.Find("gameSys").transform; }