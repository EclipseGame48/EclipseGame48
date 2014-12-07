#pragma strict

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

// Wayponts
var waypointTimer : float;
var goingToWaypoint : boolean;
var waypoint : Vector3;

// Physics
var preMoveVelocity : Vector2;
var velocity : Vector3;
var prevOnGround : boolean;

// Controls
var Touch : ClassTouch;

// Other
var controller : CharacterController;
//var animchar : AnimChar;
var hit : RaycastHit;
var pushHit : RaycastHit;
var solidHitLayer : LayerMask;
var pushableHitLayer : LayerMask;
var closestButton : GameObject;

@HideInInspector
var anim : Transform;

function Start()
{
	controller = GetComponent(CharacterController);
	anim = transform.Find("kri");
	//animchar = GetComponent(AnimChar);
	
	// Setup animations
	anim.GetComponent.<Animation>()["stand"].layer = 1;
	anim.GetComponent.<Animation>()["run"].layer = 1;
	anim.GetComponent.<Animation>()["run"].speed = 1.2;
	anim.GetComponent.<Animation>()["jump"].layer = 2;
	anim.GetComponent.<Animation>()["fall"].layer = 1;
	anim.GetComponent.<Animation>()["land"].layer = 1;
}

function Update()
{
	// Keyboard Controls
	KeyboardControls();
	// Touch Controls
	TouchControls_v3();
	
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
				
				anim.GetComponent.<Animation>().Stop("jump");
				
				// Do landing animation
				if (velocity.y < -6)
				{
					anim.GetComponent.<Animation>()["land"].wrapMode = WrapMode.Once;
					anim.GetComponent.<Animation>().CrossFade("land", 0.1);
				}
				
				// Stop movement
				if (Input.GetMouseButton(0))
				{ velocity.y = 0; }
				else
				{ velocity = Vector3.zero; }
			}
			
			// Stand/Run
			if (Vector3(velocity.x,0,velocity.z).magnitude > 3) // Running animation
			{
				anim.GetComponent.<Animation>()["run"].wrapMode = WrapMode.Loop;
				anim.GetComponent.<Animation>().CrossFade("run", 0.1);
			}
			else // Standing animation
			{
				if (!anim.GetComponent.<Animation>().IsPlaying("land"))
				{
					anim.GetComponent.<Animation>()["stand"].wrapMode = WrapMode.Loop;
					anim.GetComponent.<Animation>().CrossFade("stand", 0.1);
				}
			}
			
			// Keep normal velocity on platforms
			velocity.y = -1;
			var rc_cur = Physics.Raycast(transform.position+Vector3.up*0.1, -Vector3.up, 0.4, solidHitLayer);
			var need_jump = !rc_cur && prevOnGround;
			prevOnGround = rc_cur;
			if (need_jump)
			{
				//velocity.y = -1;
				if (velocity.magnitude > 3 && (Input.GetMouseButton(0) || goingToWaypoint)) // Edge jumping
				{ Jump(); }
			}
			//else
			//{ velocity.y = -10; }
		//}
		
		// Pushing objects
		if (velocity.magnitude > 0.8)
		{
			if (Physics.Raycast(transform.position+Vector3.up, Vector3(velocity.x,0,velocity.y), pushHit, 1, pushableHitLayer))
			{
				var pushPos = pushHit.transform.position;
				//print("Pushing box");
				if (velocity.x > 0.8 && transform.position.z > pushPos.z-1 && transform.position.z < pushPos.z+1)
				{ pushHit.collider.GetComponent(scr_pushcrate).PushForward(pushHit.transform.position+Vector3.right*2,1,true); }
				if (velocity.x < -0.8 && transform.position.z > pushPos.z-1 && transform.position.z < pushPos.z+1)
				{ pushHit.collider.GetComponent(scr_pushcrate).PushForward(pushHit.transform.position+Vector3.right*-2,1,true); }
				if (velocity.y > 0.8 && transform.position.x > pushPos.x-1 && transform.position.x < pushPos.x+1)
				{ pushHit.collider.GetComponent(scr_pushcrate).PushForward(pushHit.transform.position+Vector3.forward*2,1,true); }
				if (velocity.y < -0.8 && transform.position.x > pushPos.x-1 && transform.position.x < pushPos.x+1)
				{ pushHit.collider.GetComponent(scr_pushcrate).PushForward(pushHit.transform.position+Vector3.forward*-2,1,true); }
			}
		}
	}
	else
	{ jump = true; }
	
	if (jump)
	{
		jump = true;
		damping = damping_air;
		speed = speed_air;
		
		anim.GetComponent.<Animation>()["fall"].wrapMode = WrapMode.Loop;
		anim.GetComponent.<Animation>().CrossFade("fall", 0.1);
		
		// Gravity
		velocity += Physics.gravity*Time.deltaTime;
	}
	
	// Move body
	controller.Move(velocity*Time.deltaTime);
	
	// Animate
	/*var hspeed : float = Vector3(velocity.x,0,velocity.z).magnitude;
	animchar.SetAnimation( hspeed > 0.5 ? "run" : "stand" );
	if( Mathf.Abs( velocity.x ) > 0.1 )
		animchar.Turn( velocity.x > 0 );*/
}

function LateUpdate()
{
	if (Time.time != 0 && Time.deltaTime != 0)
	{
		if (Vector3(velocity.x,0,velocity.z).magnitude > 1 && !jump)
		{ var turnTarget = Quaternion.LookRotation(Vector3(velocity.x,0,velocity.z), Vector3.up); }
		
		if (jump)
		{ var animEuler = Vector3(0,0,Vector3(velocity.x,0,velocity.z).magnitude*velocity.y*10); }
		else
		{ animEuler = Vector3.zero; }
		
		if( turnTarget.w )
		{ anim.rotation = Quaternion.Lerp(anim.rotation, turnTarget*Quaternion.Euler(animEuler), 15*Time.deltaTime); }
	}
}

function KeyboardControls()
{
	velocity.x += Input.GetAxis("Horizontal")*speed*Time.deltaTime;
	velocity.z += Input.GetAxis("Vertical")*speed*Time.deltaTime;
	if (Input.GetButtonDown("Jump"))
	{ Jump(); }
}

function TouchControls_v3()
{
	// Calculate touch movement velocity
	if ( Input.GetMouseButtonDown(0) )
	{
		Touch.center = Input.mousePosition;
		Touch.preLoc = Input.mousePosition;
		
		waypointTimer = 0.3;
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
		
		// Cancel waypoints
		if (goingToWaypoint)
		{
			if (Vector2.Distance(Touch.offset,Touch.center) > 3)
			{ goingToWaypoint = false; }
		}
		
		// Flicking
		if (Touch.velocity.magnitude > 0)
		{ Touch.timer = 0.5; }
		else
		{
			if (Touch.timer > 0)
			{ Touch.timer -= Time.deltaTime; }
		}
	}
	else
	{ Touch.offset = Vector2.zero; }
	
	if (waypointTimer > 0)
	{ waypointTimer -= Time.deltaTime; }
	
	if ( Input.GetMouseButtonUp(0) )
	{
		// Set waypoints
		if (waypointTimer > 0 && Touch.velocity.magnitude < 0.8)
		{
			var ray : Ray = Camera.main.ScreenPointToRay( Input.mousePosition );
			var wayHit : RaycastHit;
			if( Physics.Raycast( ray, wayHit, 1000, solidHitLayer ) )
			{
				if (wayHit.normal.y > 0.8)
				{
					print("Going to waypoint!");
					goingToWaypoint = true;
					waypoint = wayHit.point;
				}
			}
		}
	
		// Flicking
		/*if (Touch.timer >= 0)
		{
			if (Touch.velocity.y > 2)
			{ Jump(); }
			
			if (Touch.velocity.y < -2)
			{ Stomp(); }
		}*/
	}
	
	if (goingToWaypoint)
	{
		var myPos = transform.position;
		preMoveVelocity = Vector2.Lerp(preMoveVelocity,Vector2(waypoint.x,waypoint.z)-Vector2(myPos.x,myPos.z),10*Time.deltaTime);
		
		// Jump over obstacles
		if (waypoint.y > myPos.y)
		{
			if (Physics.Raycast(transform.position+Vector3.up, Vector3(waypoint.x,0,waypoint.z)-Vector3(myPos.x,0,myPos.z), 2, solidHitLayer))
			{
				if (waypoint.y-myPos.y > 3) // If too high, give up
				{ goingToWaypoint = false; }
				else
				{ Jump(); }
			}
		}
		
		// Finish
		if (Vector3.Distance(myPos,waypoint) < 0.5)
		{ goingToWaypoint = false; }
	}
	else
	{ preMoveVelocity = Vector2.Lerp(preMoveVelocity,Touch.offset,10*Time.deltaTime); }
	
	velocity.x += preMoveVelocity.x*speed*Time.deltaTime;
	velocity.z += preMoveVelocity.y*speed*Time.deltaTime;
}

function TouchControls_v2()
{
	var movedir : Vector2;
	if( Input.GetMouseButton(0) )
	{
		var ray : Ray = Camera.main.ScreenPointToRay( Input.mousePosition );
		var hit : RaycastHit;
		if( Physics.Raycast( ray, hit, 1000, solidHitLayer ) )
		{
			var dir : Vector3 = hit.point - transform.position;
			var is_surface_point = Vector3.Dot( hit.normal, Vector3(0,1,0) ) > 0.8;
			
			// special hack: exclude points substantially further than player from camera AND from top at the same time
			if( is_surface_point &&
				Vector3.Dot( ray.direction, hit.point ) > Vector3.Dot( ray.direction, transform.position ) + 2 &&
				Vector3.Dot( Vector3(0,-1,0), hit.point ) > Vector3.Dot( Vector3(0,-1,0), transform.position ) + 1 )
			{
				is_surface_point = false;
			}
			
			if( is_surface_point )
			{
				movedir = Vector2(dir.x,dir.z).normalized;
				
				var hdist = Mathf.Sqrt( dir.x * dir.x + dir.z * dir.z );
				var vdist = dir.y;
				if( vdist > 1 && vdist < 5 )
				{
					var q = hdist - vdist;
				//	Debug.Log( "hdist = " + hdist + ", vdist = " + vdist + ", q = " + q + ", dot = " + Vector2.Dot( preMoveVelocity, movedir.normalized ) );
					if( hdist < 5 && q > -2 && q < 4 && Vector2.Dot( preMoveVelocity, movedir.normalized ) > 0.9 )
						Jump();
				}
			}
			else
				movedir = Vector2(dir.x,0).normalized;
		}
	}
	
	preMoveVelocity = Vector2.Lerp(preMoveVelocity,movedir*1.2,10*Time.deltaTime);
	
	velocity.x += preMoveVelocity.x * speed * Time.deltaTime;
	velocity.z += preMoveVelocity.y * speed * Time.deltaTime;
}

function TouchControls()
{
	// Calculate touch movement velocity
	if ( Input.GetMouseButtonDown(0) )
	{
		Touch.center = Input.mousePosition;
		Touch.preLoc = Input.mousePosition;
		
		//if (jump)
		//{ Jump(); }
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
		if (Touch.velocity.magnitude > 0)
		{ Touch.timer = 0.5; }
		else
		{
			if (Touch.timer > 0)
			{ Touch.timer -= Time.deltaTime; }
		}
	}
	else
	{ Touch.offset = Vector2.zero; }
	
	if ( Input.GetMouseButtonUp(0) )
	{
		if (Touch.timer >= 0)
		{
			if (Touch.velocity.y > 2)
			{ Jump(); }
			
			if (Touch.velocity.y < -2)
			{ Stomp(); }
		}
	}
	
	preMoveVelocity = Vector2.Lerp(preMoveVelocity,Touch.offset,10*Time.deltaTime);
	
	velocity.x += preMoveVelocity.x*speed*Time.deltaTime;
	velocity.z += preMoveVelocity.y*speed*Time.deltaTime;
}

function Jump()
{
	if (!jump)
	{
		anim.GetComponent.<Animation>().Stop("jump");
		anim.GetComponent.<Animation>()["jump"].wrapMode = WrapMode.Once;
		anim.GetComponent.<Animation>().CrossFade("jump", 0.1);
		JumpUp();
	}
	else if (doubleJumpEnabled && !jumpDouble)
	{
		anim.GetComponent.<Animation>().Stop("jump");
		anim.GetComponent.<Animation>()["jump"].wrapMode = WrapMode.Once; // Placeholder - will later use a flip animation
		anim.GetComponent.<Animation>().CrossFade("jump", 0.1);
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

function OnTriggerStay(hit : Collider)
{
	if (hit.gameObject.layer == 10) // Item
	{
		if (hit.gameObject.GetComponent(scr_crystal))
		{
			var AudioObj = PlayClipAt(hit.gameObject.GetComponent(scr_crystal).getSound, hit.transform.position);
			AudioObj.audio.minDistance = 20;
			hit.gameObject.GetComponent(scr_crystal).Die();
			
			//Camera.main.GetComponent(hud).score += 200;
			//Camera.main.GetComponent(hud).crystals += 1;
		}
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
	
	var enemy = hit.gameObject.GetComponent(Enemy);
	if( enemy )
	{
		enemy.Hit( velocity.y < -10 );
	}
}

function PlayClipAt(clip: AudioClip, pos: Vector3)
{
	var tempGO = GameObject("TempAudio");
	tempGO.transform.position = pos;
	var aSource = tempGO.AddComponent(AudioSource);
	aSource.clip = clip;

	aSource.Play();
	Destroy(tempGO, clip.length);
	
	return tempGO;
}

