import { DataSourceState } from '@epam/uui';
import React, { useCallback, useMemo, useState } from 'react';
import { pageSizes } from 'shared';
import {
    FilterWithDocumentExtraOption,
    Sorting,
    SortingDirection,
    TableFilters
} from '../../api/typings';
import { getFiltersSetter } from '../helpers/set-filters';

type Page = Record<'page' | 'pageSize', number>;

export const usePageTable = <T, TFilter = TableFilters<T>>(item: keyof T) => {
    const [pageConfig, setPageConfig] = useState<Page>({
        page: 1,
        pageSize: pageSizes._15
    });
    const [sortConfig, setSortConfig] = useState<Sorting<keyof T>>({
        field: item,
        direction: SortingDirection.DESC
    });
    const [totalCount, setTotalCount] = useState<number>(1);
    const [searchText, setSearchText] = useState<string>('');
    const [tableValue, onTableValueChange] = useState<DataSourceState<TFilter>>({});
    const [filters, setF] = React.useState<Array<FilterWithDocumentExtraOption<keyof T>>>([]);

    const onPageChange = useCallback(
        (page: number, pageSize?: number) => {
            setPageConfig({ page, pageSize: pageSize ?? pageConfig.pageSize });
        },
        [pageConfig]
    );

    const setFilters = useCallback(getFiltersSetter<T>(filters, setF), [filters]);

    const onTotalCountChange = (value: number | undefined) => {
        if (value && value >= 1) {
            setTotalCount(value);
        } else {
            setTotalCount(1);
        }
    };

    return useMemo(
        () => ({
            pageConfig,
            setPageConfig,
            onPageChange,
            totalCount,
            onTotalCountChange,
            searchText,
            setSearchText,
            tableValue,
            onTableValueChange,
            sortConfig,
            setSortConfig,
            setFilters,
            filters
        }),
        [
            pageConfig.page,
            pageConfig.pageSize,
            totalCount,
            searchText,
            tableValue,
            sortConfig?.field,
            sortConfig?.direction,
            filters
        ]
    );
};
