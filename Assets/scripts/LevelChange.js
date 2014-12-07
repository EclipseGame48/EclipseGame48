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
	Application.LoadLevel( targetLevel );
}

