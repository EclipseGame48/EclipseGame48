#pragma strict

class Animation
{
	var name : String;
	var fps : float = 5;
	var frames : Sprite[];
};

var startAnimation : String;
var startIsRight : boolean;
var animations : Animation[];

private var currentFrame : float = 0.0;
private var curAnimObj : Animation;
private var currentAnimation : String;
private var currentDirection : boolean;

private var applyGameObject : GameObject;
private var applySpriteRenderer : SpriteRenderer;
private var originalScaleX : float;

function SetAnimation( name : String )
{
	if( currentAnimation == name )
		return;
	currentFrame = 0;
	currentAnimation = name;
	for( var i : int = 0; i < animations.length; ++i )
	{
		var anim : Animation = animations[ i ];
		if( anim.name == currentAnimation )
		{
			curAnimObj = anim;
			break;
		}
	}
	Anim_ApplyFrame();
}

function Turn( dir : boolean )
{
	currentDirection = dir;
	Anim_ApplyDir();
}

function Start()
{
	var child_sprites : Component[] = GetComponentsInChildren( SpriteRenderer );
	applyGameObject = child_sprites[0].gameObject;
	applySpriteRenderer = child_sprites[0] as SpriteRenderer;
	originalScaleX = applyGameObject.transform.localScale.x;
	
	applySpriteRenderer.castShadows = true;
	
	SetAnimation( startAnimation );
	Turn( startIsRight );
}

function Update()
{
	if( curAnimObj )
		currentFrame += curAnimObj.fps * Time.deltaTime;
	Anim_ApplyFrame();
}


private function Anim_ApplyFrame()
{
	if( curAnimObj )
	{
		var fid : int = Mathf.Floor( currentFrame ) % curAnimObj.frames.length;
		applySpriteRenderer.sprite = curAnimObj.frames[ fid ];
	}
}

private function Anim_ApplyDir()
{
	applyGameObject.transform.localScale.x = currentDirection ? originalScaleX : -originalScaleX;
}

