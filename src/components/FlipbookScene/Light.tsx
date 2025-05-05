interface LightProps {
  position?: [number, number, number];
  intensity?: number;
  color?: string;
  enableShadows?: boolean;
  lowQuality?: boolean;
}

export const Light = ({
  position = [0, 7.5, 5],
  intensity = 1,
  color = "#ffffff",
  enableShadows = true,
  lowQuality = false,
}: LightProps) => {
  const shadowSettings = {
    castShadow: enableShadows && !lowQuality,
    "shadow-mapSize-width": lowQuality ? 512 : 1024,
    "shadow-mapSize-height": lowQuality ? 512 : 1024,
    "shadow-bias": -0.0005,
  };

  return (
    <group>
      <ambientLight intensity={lowQuality ? 0.3 : 0.5} />
      <directionalLight
        position={position}
        intensity={lowQuality ? intensity * 0.7 : intensity}
        color={color}
        {...shadowSettings}
      />
      {!lowQuality && (
        <directionalLight position={[-5, 5, 5]} intensity={0.3} />
      )}
    </group>
  );
};
