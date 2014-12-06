#pragma strict


var path : Vector3[];
var isSmoothPath : boolean = true;
var pathPosition : float = 0.0;
var pathSpeed : float = 1.0;
var canDestroy : boolean = true;

private var basePosition : Vector3;
private var isAlive : boolean = true;


function Start()
{
	basePosition = GetComponent(Transform).position;
	var srnd : SpriteRenderer = GetComponent(SpriteRenderer);
	if( srnd )
		srnd.castShadows = true;
}

function Update()
{
	pathPosition = ( pathPosition + Time.deltaTime * pathSpeed ) % path.length;
	GetComponent(Transform).position = basePosition + Path_GetInterpolatedPosition();
}


function Path_GetInterpolatedPosition()
{
	var idx1 : int = Mathf.Floor( pathPosition );
	var idx2 : int = ( idx1 + 1 ) % path.length;
	var t : float = pathPosition - idx1;
	if( isSmoothPath )
	{
		var idx0 : int = ( idx1 + path.length - 1 ) % path.length;
		var idx3 : int = ( idx2 + 1 ) % path.length;
		var p0 = path[ idx1 ];
		var p3 = path[ idx2 ];
		var p1 = p0 + ( p3 - path[ idx0 ] ) * 1.0 / 3.0;
		var p2 = p3 + ( p0 - path[ idx3 ] ) * 1.0 / 3.0;
		var p01 : Vector3 = Vector3.Lerp( p0, p1, t );
		var p12 : Vector3 = Vector3.Lerp( p1, p2, t );
		var p23 : Vector3 = Vector3.Lerp( p2, p3, t );
		var p012 : Vector3 = Vector3.Lerp( p01, p12, t );
		var p123 : Vector3 = Vector3.Lerp( p12, p23, t );
		return Vector3.Lerp( p012, p123, t );
	}
	else
		return Vector3.Lerp( path[ idx1 ], path[ idx2 ], t );
}


function Kill()
{
	if( isAlive )
	{
		isAlive = false;
		// TODO FX / STATS?
	}
}

function Hit( power : boolean )
{
	if( power && canDestroy )
		Kill();
}

