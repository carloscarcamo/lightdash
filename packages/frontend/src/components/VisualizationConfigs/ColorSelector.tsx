import { ECHARTS_DEFAULT_COLORS } from '@lightdash/common';
import {
    ColorPicker as MantineColorPicker,
    ColorSwatch,
    Popover,
    Stack,
    TextInput,
} from '@mantine/core';
import { IconHash } from '@tabler/icons-react';
import { FC } from 'react';
import { useOrganization } from '../../hooks/organization/useOrganization';
import { isHexCodeColor } from '../../utils/colorUtils';
import MantineIcon from '../common/MantineIcon';

interface Props {
    color?: string;
    defaultColor?: string;
    swatches?: string[];
    onColorChange: (newColor: string) => void;
}

const ColorSelector: FC<Props> = ({
    color,
    defaultColor = 'rgba(0,0,0,.1)',
    swatches,
    onColorChange,
}) => {
    const { data } = useOrganization();

    swatches = data?.chartColors || ECHARTS_DEFAULT_COLORS;
    const isValidHexColor = color && isHexCodeColor(color);

    return (
        <Popover shadow="md" withArrow>
            <Popover.Target>
                <ColorSwatch
                    size={24}
                    color={isValidHexColor ? color : defaultColor}
                    sx={{
                        cursor: 'pointer',
                        transition: 'opacity 100ms ease',
                        '&:hover': { opacity: 0.8 },
                    }}
                />
            </Popover.Target>

            <Popover.Dropdown p="xs">
                <Stack spacing="xs">
                    <MantineColorPicker
                        size="md"
                        format="hex"
                        swatches={swatches}
                        swatchesPerRow={swatches.length}
                        value={color ?? defaultColor}
                        onChange={(newColor) => onColorChange(newColor)}
                    />

                    <TextInput
                        icon={<MantineIcon icon={IconHash} />}
                        placeholder="Type in a custom HEX color"
                        error={
                            color && !isValidHexColor
                                ? 'Invalid HEX color'
                                : undefined
                        }
                        value={(color ?? '').replace('#', '')}
                        onChange={(event) => {
                            const newColor = event.currentTarget.value;
                            onColorChange(
                                newColor === '' ? newColor : `#${newColor}`,
                            );
                        }}
                    />
                </Stack>
            </Popover.Dropdown>
        </Popover>
    );
};

export default ColorSelector;
