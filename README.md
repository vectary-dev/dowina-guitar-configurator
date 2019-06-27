# Dowina Guitar Configurator

## Install
```
npm install http-server -g
```

## Run

```
http-server -p 2222 -c-1
```

and visit

```
localhost:2222
```

## Vectary - naming

Object structure of each guitar should be the same, respecting following naming.

- XX_Front - Top
- XX_Hole - Hole depth
- XX_Back - Back
- XX_BackInside - Back side from the inside
- XX_Side - Side
- XX_Sticker - Sticker inside
- XX_FrontDetail - Decoration around the edges of the top
- XX_SideDetailFront - Decoration around the edge of the side - closer to the top
- XX_SideDetailBack - Decoration around the edge of the side - closer to the back
- XX_BackDetail - Decoration around the edges of the back
- XX_BackDetailMiddle - Decoration stripe through the middle of the back
- XX_Rosette - Rosette

Where XX is the short name of the guitar (GC, JC, BVH etc.)