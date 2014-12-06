﻿#pragma strict

// Stats
var speed_ground = 80.0;
var speed_air = 10.0;

var damping_ground = 10.0;
var damping_air = 1.0;

var speed = 80.0;
var maxSpeed = 6.0;
var damping = 1.0;

var doubleJumpEnabled : boolean;

// States
var jump : boolean;
var jumpDouble : boolean;
var dead : boolean;

// Physics
var preMoveVelocity : Vector2;
var velocity : Vector3;

// Controls
class ClassTouch
{
	var range = 64.0;
	var velocity : Vector2;
	var offset : Vector2;
	var center : Vector2;
	
	var preLoc : Vector2;

	var timer : float;
}
var Touch : ClassTouch;

// Other
var controller : CharacterController;
var hit : RaycastHit;
var solidHitLayer : LayerMask;

function Start()
{
	controller = GetComponent(CharacterController);
}

function Update()
{
	// Keyboard Controls
	KeyboardControls();
	// Touch Controls
	TouchControls();
	
	// Physics
	velocity.x = Mathf.Lerp(velocity.x,0,damping*Time.deltaTime);
	velocity.z = Mathf.Lerp(velocity.z,0,damping*Time.deltaTime);
	
	if (Vector2(velocity.x,velocity.z).magnitude > maxSpeed)
	{
		var tempVel = Vector2(velocity.x,velocity.z).normalized*maxSpeed;
		velocity = Vector3(tempVel.x,velocity.y,tempVel.y);
	}
	
	// Checking ground
	if ((controller.collisionFlags & CollisionFlags.Below))
	{
		// Landing after a jump		
		/*if (Physics.SphereCast(transform.position+Vector3(0.0,controller.radius+0.05,0.0), controller.radius, -Vector3.up
			, hit, 0.1, solidHitLayer))
		{*/
			if (jump)
			{
				jump = false;
				jumpDouble = false;
				damping = damping_ground;
				speed = speed_ground;
				velocity.y = 0;
			}
			
			// Keep normal velocity on platforms
			if (!Physics.Raycast(transform.position+Vector3.up*0.1, -Vector3.up, 0.4, solidHitLayer))
			{
				velocity.y = -1;
				if (Touch.offset.magnitude > 0.8)
				{ Jump(); }
			}
			else
			{ velocity.y = -10; }
		//}
		
	}
	else
	{ jump = true; }
	
	if (jump)
	{
		jump = true;
		damping = damping_air;
		speed = speed_air;
		// Gravity
		velocity += Physics.gravity*Time.deltaTime;
	}
	
	// Move body
	controller.Move(velocity*Time.deltaTime);
}

function KeyboardControls()
{
	velocity.x += Input.GetAxis("Horizontal")*speed*Time.deltaTime;
	velocity.z += Input.GetAxis("Vertical")*speed*Time.deltaTime;
	if (Input.GetButtonDown("Jump"))
	{ Jump(); }
}

function TouchControls()
{
	// Calculate touch movement velocity
	if ( Input.GetMouseButtonDown(0) )
	{
		Touch.center = Input.mousePosition;
		Touch.preLoc = Input.mousePosition;
	}
	else if ( Input.GetMouseButton(0) )
	{
		// Calculate velocity
		Touch.velocity = Input.mousePosition - Touch.preLoc;
		Touch.preLoc = Input.mousePosition;
		
		// Touch functionality
		if (Vector2.Distance(Touch.offset,Touch.center) > 10)
		{ Touch.offset = ((Input.mousePosition - Touch.center)).normalized; }
		if (Vector2.Distance(Input.mousePosition,Touch.center) > Touch.range)
		{ Touch.center = Input.mousePosition+Touch.offset*-Touch.range; }
		
		// Flicking
		/*if (Touch.velocity.magnitude > 1)
		{ Touch.timer = 0.5; }
		else
		{
			if (Touch.timer > 0)
			{ Touch.timer -= Time.deltaTime; }
		}*/
	}
	else
	{ Touch.offset = Vector2.zero; }
	
	/*if ( Input.GetMouseButtonUp(0) )
	{
		if (Touch.timer >= 0)
		{
			if (Touch.velocity.y > 15)
			{ Jump(); }
			
			if (Touch.velocity.y < -15)
			{ Stomp(); }
		}
	}*/
	
	preMoveVelocity = Vector2.Lerp(preMoveVelocity,Touch.offset,10*Time.deltaTime);
	
	velocity.x += preMoveVelocity.x*speed*Time.deltaTime;
	velocity.z += preMoveVelocity.y*speed*Time.deltaTime;
}

function Jump()
{
	if (!jump)
	{ JumpUp(); }
	else if (doubleJumpEnabled && !jumpDouble && velocity.y < 2)
	{
		jumpDouble = true;
		JumpUp();
	}
}

function JumpUp()
{
	controller.Move(Vector3.up*0.001);
	velocity.y = 10;
	
	var velNorm = velocity.normalized;
	velocity = Vector3(velNorm.x*20,velocity.y,velNorm.z*20);
	
	jump = true;
}

function Stomp()
{
	if (jump && velocity.y < 3)
	{
		velocity.y = -10;
	}
}

function OnControllerColliderHit(hit : ControllerColliderHit)
{
	if ( jump && ((controller.collisionFlags & CollisionFlags.Sides) || (controller.collisionFlags & CollisionFlags.Above)) )
	{
		if (Vector3.Dot(hit.normal,velocity) < 0)
		{ velocity -= hit.normal * Vector3.Dot( hit.normal, velocity ); }
	}
	if ( !jump && (controller.collisionFlags & CollisionFlags.Sides) )
	{
		velocity.x = controller.velocity.x;
		velocity.z = controller.velocity.z;
	}
}