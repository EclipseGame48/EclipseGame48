#pragma strict


var targetLevel : String;

function OnTriggerEnter( col : Collider )
{
	if( col.gameObject.name == "player" )
	{
		Camera.current.SendMessage( "BeginFadeOut", gameObject );
	}
}

function FadeOutFinished()
{
	if( targetLevel == "EXIT" )
	{
		Application.Quit();
		Debug.Log( "QUIT!" );
		return;
	}
	Application.LoadLevel( targetLevel );
}

