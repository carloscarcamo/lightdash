import { FieldId, fieldId, FilterableField } from '@lightdash/common';
import { Group, Skeleton } from '@mantine/core';
import { FC } from 'react';
import { useDashboardContext } from '../../../providers/DashboardProvider';
import Filter from '../Filter';

interface ActiveFiltersProps {
    isEditMode: boolean;
}

const ActiveFilters: FC<ActiveFiltersProps> = ({ isEditMode }) => {
    const {
        dashboardFilters,
        dashboardTemporaryFilters,
        updateDimensionDashboardFilter,
        removeDimensionDashboardFilter,
        allFilterableFields,
        isLoadingDashboardFilters,
        isFetchingDashboardFilters,
    } = useDashboardContext();

    if (isLoadingDashboardFilters || isFetchingDashboardFilters) {
        return (
            <Group spacing="xs" ml="xs">
                <Skeleton h={30} w={100} radius={4} />
                <Skeleton h={30} w={100} radius={4} />
                <Skeleton h={30} w={100} radius={4} />
                <Skeleton h={30} w={100} radius={4} />
                <Skeleton h={30} w={100} radius={4} />
            </Group>
        );
    }

    if (!allFilterableFields) return null;

    const fieldMap = allFilterableFields?.reduce<
        Record<FieldId, FilterableField>
    >((acc, field) => ({ ...acc, [fieldId(field)]: field }), {});

    return (
        <>
            {dashboardFilters.dimensions
                .filter((item) => !!fieldMap[item.target.fieldId])
                .map((item, index) => (
                    <Filter
                        key={item.id}
                        isEditMode={isEditMode}
                        field={fieldMap[item.target.fieldId]}
                        filterRule={item}
                        onRemove={() =>
                            removeDimensionDashboardFilter(index, false)
                        }
                        onUpdate={(value) =>
                            updateDimensionDashboardFilter(value, index, false)
                        }
                    />
                ))}

            {dashboardTemporaryFilters.dimensions
                .filter((item) => !!fieldMap[item.target.fieldId])
                .map((item, index) => (
                    <Filter
                        key={item.id}
                        isTemporary
                        isEditMode={isEditMode}
                        field={fieldMap[item.target.fieldId]}
                        filterRule={item}
                        onRemove={() =>
                            removeDimensionDashboardFilter(index, true)
                        }
                        onUpdate={(value) =>
                            updateDimensionDashboardFilter(value, index, true)
                        }
                    />
                ))}
        </>
    );
};

export default ActiveFilters;
