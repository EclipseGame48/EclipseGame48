private var i = 0.5;

function Update ()
{
	i -= Time.deltaTime;
	if (GetComponent.<ParticleSystem>() != null && GetComponent.<ParticleSystem>().particleCount == 0 && i < 0)
	{ Destroy(gameObject); }
}