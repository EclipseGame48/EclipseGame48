#pragma strict


var raiseSpeed : float = 3.0;
var raiseHeight : float = 5.0;

private var currentHeight : float = 1;
private var heightTarget : float = 1;
private var initialPosition : Vector3;


function Start()
{
	initialPosition = GetComponent(Transform).position;
}

function Update()
{
	currentHeight += Mathf.Sign( heightTarget - currentHeight ) * Mathf.Min( Time.deltaTime * raiseSpeed, Mathf.Abs( heightTarget - currentHeight ) );
	GetComponent(Transform).position = initialPosition + Vector3( 0, raiseHeight * ( 1 - currentHeight ), 0 );
}


function Open(){ heightTarget = 1; }
function Close(){ heightTarget = 0; }

