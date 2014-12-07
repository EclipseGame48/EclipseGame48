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




var fadeSpeed : float = 1;

private var fadeLevel : float = -1;
private var fadeTarget : float = 0;
private var fadeObjBack : GameObject;



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
	// FADING
	fadeLevel += Mathf.Sign( fadeTarget - fadeLevel ) * Mathf.Min( Time.deltaTime * fadeSpeed, Mathf.Abs( fadeTarget - fadeLevel ) );
	if( fadeLevel == 1 )
	{
		fadeObjBack.SendMessage( "FadeOutFinished" );
	}
	
	
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
	{ Application.LoadLevel(Application.loadedLevelName); }

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



function BeginFadeOut( objback : GameObject )
{
	fadeTarget = 1;
	fadeObjBack = objback;
}


static var colorMaterial : Material;
static function CreateColorMaterial()
{
	if( !colorMaterial )
	{
		colorMaterial = new Material( "Shader \"Vertex Color Only\" {" +
			"SubShader { Pass { " +
			"    Blend SrcAlpha OneMinusSrcAlpha " +
			"    ZWrite Off Cull Off Fog { Mode Off } " +
			"    BindChannels {" +
			"      Bind \"vertex\", vertex Bind \"color\", color }" +
			"} } }" );
		colorMaterial.hideFlags = HideFlags.HideAndDontSave;
		colorMaterial.shader.hideFlags = HideFlags.HideAndDontSave;
	}
}

function OnPostRender()
{
	if( fadeLevel != 0 )
	{
		CreateColorMaterial();
		colorMaterial.SetPass( 0 );
		
		var finsize : float = 0.1;
		var fullwidth : float = 1.0;
		var z : float = 0.1;
		var x0 : float = 0 - fadeLevel * ( finsize + fullwidth );
		var x1 : float = 1 - fadeLevel * ( finsize + fullwidth );
		var x0f : float = x0 - finsize;
		var x1f : float = x1 + finsize;
		var x0b : float = x0f - fullwidth;
		var x1b : float = x1f + fullwidth;
		var y0 : float = 0;
		var y1 : float = 1;
		
		GL.PushMatrix();
		GL.LoadOrtho();
		GL.Begin( GL.QUADS );
		if( fadeLevel < 0 )
		{
			// draw left side
			GL.Color( Color(0,0,0,1) );
			// q1 (black)
			GL.Vertex3( x0b, y1, z );
			GL.Vertex3( x0b, y0, z );
			GL.Vertex3( x0f, y0, z );
			GL.Vertex3( x0f, y1, z );
			// q2 (gradient)
			GL.Vertex3( x0f, y1, z );
			GL.Vertex3( x0f, y0, z );
			GL.Color( Color(0,0,0,0) );
			GL.Vertex3( x0, y0, z );
			GL.Vertex3( x0, y1, z );
		}
		else
		{
			// draw right side
			GL.Color( Color(0,0,0,1) );
			// q1 (black)
			GL.Vertex3( x1b, y1, z );
			GL.Vertex3( x1b, y0, z );
			GL.Vertex3( x1f, y0, z );
			GL.Vertex3( x1f, y1, z );
			// q2 (gradient)
			GL.Vertex3( x1f, y1, z );
			GL.Vertex3( x1f, y0, z );
			GL.Color( Color(0,0,0,0) );
			GL.Vertex3( x1, y0, z );
			GL.Vertex3( x1, y1, z );
		}
		GL.End();
		GL.PopMatrix();
	}
}

