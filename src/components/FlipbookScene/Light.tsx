interface LightProps {
  position?: [number, number, number];
  intensity?: number;
  color?: string;
}

export const Light = ({
  position = [0, 7.5, 5],
  intensity = 1,
  color = "#ffffff",
}: LightProps) => {
  return (
    <group>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={position}
        intensity={intensity}
        castShadow
        color={color}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[-5, 5, 5]} intensity={0.5} />
    </group>
  );
};
