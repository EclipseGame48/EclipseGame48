#pragma strict


var target : GameObject;
var enableAction : String;
var disableAction : String;
var switchSpeed : float = 10.0;
var sinkDepth : float = 0.1;
var isSticky : boolean = false;
var ignoredBlockerCount : int = 1;

private var currentHeight : float = 1;
private var heightTarget : float = 1;
private var reachedTarget : boolean = true;
private var initialPosition : Vector3;
private var blockerCount : int = 0;
private var currentState : boolean = false;


function Start()
{
	initialPosition = GetComponent(Transform).position;
}

function Update()
{
	currentHeight += Mathf.Sign( heightTarget - currentHeight ) * Mathf.Min( Time.deltaTime * switchSpeed, Mathf.Abs( heightTarget - currentHeight ) );
	if( !reachedTarget && currentHeight == heightTarget )
	{
		currentState = heightTarget == 1;
		target.SendMessage( heightTarget == 1 ? enableAction : disableAction, heightTarget == 1 );
		reachedTarget = true;
	}
	GetComponent(Transform).position = initialPosition + Vector3( 0, -sinkDepth * ( 1 - currentHeight ), 0 );
}

function OnTriggerEnter( other : Collider )
{
	ChangeStepCount( 1 );
}

function OnTriggerExit( other : Collider )
{
	ChangeStepCount( -1 );
}

function ChangeStepCount( diff : int )
{
	blockerCount += diff;
//	Debug.Log( blockerCount );
	if( blockerCount > ignoredBlockerCount )
	{
		if( heightTarget != 0 )
		{
			reachedTarget = false;
			heightTarget = 0;
		}
	}
	else
	{
		if( isSticky && currentHeight == 1 )
			return;
		if( heightTarget != 1 )
		{
			reachedTarget = false;
			heightTarget = 1;
		}
	}
}

function IsPressed(){ return currentState; }

