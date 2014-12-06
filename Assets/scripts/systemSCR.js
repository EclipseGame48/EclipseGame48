class ClassConsoleGraph
{
	var bottom : float;
	var back : Texture2D;
	var endSymbol : String;
	
	var textStyle : GUIStyle;
}
class ClassConsole
{
	var enabled : boolean;
	var inputText : String;
	var historyText : String[];
	
	//var historyText = new Array( [ ] );
}
class ClassCheats
{
	var godMode : boolean;
	var noclip : boolean;
	
	//var player : Transform;
}

var console : ClassConsole;
var graphics : ClassConsoleGraph;
var cheats : ClassCheats;

function Start()
{
	//if (!cheats.player)
	//{ cheats.player = GameObject.Find("player").transform; }
	
	if (GameObject.Find("gameSys").transform)
	{
		if (GameObject.Find("gameSys").transform != transform)
		{
			Destroy(gameObject);
			Camera.main.GetComponent(scr_cam).findGameSys();
		}
	}

	Screen.orientation = ScreenOrientation.LandscapeLeft;
	console.historyText = new String[64];
	
	for(var i=0;i<console.historyText.Length;i++)
	{
		console.historyText[i] = "";//"Text " + i.ToString();
	}
	
	DontDestroyOnLoad(gameObject);
}

function Update()
{
	if (Input.GetKeyDown(KeyCode.BackQuote))
	{
		toggleConsole();
	}
	
	if (console.enabled)
	{		
		for (var c : char in Input.inputString)
		{
			// Backspace - Remove the last character
			if (c == "\b"[0])
			{
				if (console.inputText.Length != 0)
				{ console.inputText = console.inputText.Substring(0, console.inputText.Length - 1); }
			}
			else if (c == "\n"[0] || c == "\r"[0]) // "\n" for Mac, "\r" for windows.
			{ executeCommand(); }
			else if (c != "`") // Write text
			{ console.inputText += c; }
		}
	}
}

function OnGUI()
{
	GUI.color.a = 1;
	GUI.depth = -100000;
	
	// Draw the console
	if (console.enabled)
	{
		// Make the end symbol of the command blink
		if (Mathf.Sin(700*Time.time*Mathf.PI/180) > 0.5)
		{ graphics.endSymbol = "_"; }
		else
		{ graphics.endSymbol = " "; }
	
		// Bacgrkound
		GUI.DrawTexture(Rect(0,0,Screen.width,graphics.bottom), graphics.back);
		GUI.DrawTexture(Rect(0,graphics.bottom-16,Screen.width,16), graphics.back);
		
		// User Input Text
		GUI.Label(Rect(0,graphics.bottom-16,Screen.width,16), "> " + console.inputText + graphics.endSymbol, graphics.textStyle);
		
		// History text
		for(var i=0;i<console.historyText.Length;i++)
		{
			GUI.Label(Rect(0,graphics.bottom-32-16*console.historyText.Length+16*i,Screen.width,32), console.historyText[i], graphics.textStyle);
		}
	}
}

function toggleConsole()
{
	console.enabled = !console.enabled;
	graphics.bottom = Screen.height*0.75;
	
	//console.inputText = "";
}

function executeCommand()
{
	if (console.inputText != "")
	{
		if (console.inputText == "god") // God mode
		{ toggleGodMode(); }
		else if (console.inputText == "noclip") // No clipping
		{ toggleNoclip(); }
		else if (console.inputText == "reset") // Reset map
		{ Application.LoadLevel(Application.loadedLevelName); }
		/*else if (console.inputText == "kill" || console.inputText == "suicide") // Suicide
		{
			if (cheats.player != null)
			{
				cheats.player.GetComponent(scr_player).health = 0.0;
				writeHistory("Congratulations, you have performed a suicide!");
			}
			else
			{ writeHistory("player not found"); }
		}*/
		else if (console.inputText == "quit" || console.inputText == "exit") // Reset map
		{ Application.Quit(); }
		else
		{ writeHistory("Unknown command - " + console.inputText); }
		
		console.inputText = "";
	}
}

function toggleGodMode()
{
	if (cheats.godMode)
	{ writeHistory("god mode disabled"); }
	else
	{ writeHistory("god mode enabled"); }
	cheats.godMode = !cheats.godMode;
}

function toggleNoclip()
{
	if (cheats.noclip)
	{ writeHistory("noclip disabled"); }
	else
	{ writeHistory("noclip enabled"); }
	cheats.noclip = !cheats.noclip;
}

function writeHistory(text : String)
{
	//var tempHistoryString = console.historyText;

	for(var i=1;i<console.historyText.Length;i++)
	{
		console.historyText[i-1] = console.historyText[i];
	}
	console.historyText[console.historyText.Length-1] = text;
	//console.historyText[0] = text;
	print(text);
}