#pragma strict

function Start()
{

}

function FixedUpdate()
{
	rigidbody.velocity.x *= 0.99;
	rigidbody.velocity.z *= 0.99;
}