
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 skytop = vec3(0.05, 0.2, 0.5);

vec3 light = normalize(vec3(0.1, 0.25, 0.9));

vec2 cloudrange = vec2(0.0, 10000.0);

mat3 m = mat3(0.00, 1.60, 1.20, -1.60, 0.72, -0.96, -1.20, -0.96, 1.28);

// hash function              
float hash(float n)
{
    return fract(cos(n) * 114514.1919);
}

// 3d noise function
float noise(in vec3 x)
{
    vec3 p = floor(x);
    vec3 f = smoothstep(0.0, 1.0, fract(x));
        
    float n = p.x + p.y * 10.0 + p.z * 100.0;
    
    return mix(
        mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
            mix(hash(n + 10.0), hash(n + 11.0), f.x), f.y),
        mix(mix(hash(n + 100.0), hash(n + 101.0), f.x),
            mix(hash(n + 110.0), hash(n + 111.0), f.x), f.y), f.z);
}

// Fractional Brownian motion
float fbm(vec3 p)
{
    float f = 0.5000 * noise(p);
    p = m * p;
    f += 0.2500 * noise(p);
    p = m * p;
    f += 0.1666 * noise(p);
    p = m * p;
    f += 0.0834 * noise(p);
    return f;
}

vec3 camera(float time)
{
    return vec3(5000.0 * sin(1.0 * time), 5000. + 1500. * sin(0.5 * time), 6000.0 * time);
}

void main()
{
    vec2 uv = 2. * gl_FragCoord.xy / u_resolution.xy - 1.0;
    uv.x *= u_resolution.x / u_resolution.y;

    float time = (u_time + 13.5 + 44.) * 1.0;
    vec3 campos = camera(time);
    vec3 camtar = camera(time + 0.4);

    vec3 front = normalize(camtar - campos);
    vec3 right = normalize(cross(front, vec3(0.0, 1.0, 0.0)));
    vec3 up = normalize(cross(right, front));
    vec3 fragAt = normalize(uv.x * right + uv.y * up + front);
    
    // clouds
    vec4 sum = vec4(0, 0, 0, 0);
    for (float depth = 0.0; depth < 100000.0; depth += 200.0)
    {
        vec3 ray = campos + fragAt * depth;
        if (cloudrange.x < ray.y && ray.y < cloudrange.y)
        {
            float alpha = smoothstep(0.5, 1.0, fbm(ray * 0.00025));
            vec3 localcolor = mix(vec3(1.1, 1.05, 1.0), vec3(0.3, 0.3, 0.2), alpha);
            alpha = (1.0 - sum.a) * alpha;
            sum += vec4(localcolor * alpha, alpha);
        }
    }
    
    float alpha = smoothstep(0.7, 1.0, sum.a);
    sum.rgb /= sum.a + 0.0001;

    float sundot = clamp(dot(fragAt, light), 0.0, 1.0);
    vec3 col = 0.8 * (skytop);
    col += 0.47 * vec3(1.6, 1.4, 1.0) * pow(sundot, 350.0);
    col += 0.4 * vec3(0.8, 0.9, 1.0) * pow(sundot, 2.0);
    
    sum.rgb -= 0.6 * vec3(0.8, 0.75, 0.7) * pow(sundot, 13.0) * alpha;
    
    sum.rgb += 0.2 * vec3(1.3, 1.2, 1.0) * pow(sundot, 5.0) * (1.0 - alpha);

    col = mix(col, sum.rgb, sum.a);

    gl_FragColor = vec4(col, 1.0);
}