#pragma strict

var moving : boolean;
var from : Vector3;
var goal : Vector3;
var moveT : float;
var moveSpeed : float;

var checkGround : boolean;

var hit : RaycastHit;
var solidHitLayer : LayerMask;

function Start()
{

}

function Update()
{
	if (moving)
	{
		moveT += moveSpeed*Time.deltaTime;
		transform.position = Vector3.Lerp(from,goal,moveT);
		if (moveT >= 1)
		{
			moving = false;
			if (checkGround)
			{
				if (!Physics.Raycast(transform.position, -Vector3.up, 1.5, solidHitLayer))
				{
					if (Physics.Raycast(transform.position+Vector3.up, -Vector3.up, hit, Mathf.Infinity, solidHitLayer))
					{ PushForward(hit.point+Vector3.up,2,false); }
				}
			}
			checkGround = false;
		}
	}
}

function PushForward(to : Vector3, sp : float, chck : boolean)
{
	if (!moving)
	{
		if (!Physics.Raycast(transform.position+Vector3.up, to-transform.position, 2.5, solidHitLayer))
		{
			moving = true;
			moveT = 0.0;
			moveSpeed = sp;
			from = transform.position;
			goal = to;
			checkGround = chck;
		}
	}
}