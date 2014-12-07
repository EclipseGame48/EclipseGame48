Shader "Blend 2 Textures" {
	Properties
	{
		_Color( "Color", Color ) = (1,1,1,1)
		_Layer1( "Layer1", 2D ) = "white" {}
		_Layer2( "Layer2", 2D ) = "white" {}
	}
	SubShader
	{
		Pass
		{
			Fog { Mode Off }
			CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			
			sampler2D    _Layer1;
			sampler2D    _Layer2;
			float         _Color;
			
			struct appdata
			{
				float4 vertex : POSITION;
				fixed4 color : COLOR;
				float2 uv_Layer1 : TEXCOORD0;
			};
			
			struct v2f
			{
				float4 pos : SV_POSITION;
				fixed4 color : COLOR;
				float2 uv_Layer1 : TEXCOORD0;
			};
			
			v2f vert( appdata v )
			{
				v2f o;
				o.pos = mul(UNITY_MATRIX_MVP, v.vertex);
				o.color = v.color;
				o.uv_Layer1 = v.uv_Layer1;
				return o;
			}
			
			float4 frag( v2f i ) : COLOR
			{
				half4 l1 = tex2D( _Layer1, i.uv_Layer1 );
				half4 l2 = tex2D( _Layer2, i.uv_Layer1 );
				return lerp( l1, l2, i.color.r );
			}
		ENDCG
		}
	}
}