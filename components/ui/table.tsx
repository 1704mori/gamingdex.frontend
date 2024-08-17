import { cn } from "@/lib/utils";
import React, { useMemo } from "react";

interface Column {
  key: string;
  label: string;
  modifyValue?: (value: any) => any;
  showLabel?: boolean;
  rules?: {
    td?: string[];
    child?: string[];
  };
  render?: (value: any) => JSX.Element;
}

interface Data {
  [key: string]:
    | string
    | React.ReactNode
    | number
    | NestedData
    | { head: string; child: React.ReactNode };
}

interface NestedData {
  [key: string]: string | React.ReactNode | number;
}

interface DeploymentListProps {
  data: Data[] | any[];
  columns: Column[];
  className?: string;
  rowsPerPage?: number;
  onPageClick?: (page: number) => void;
  totalData?: number;
  showPagination?: boolean;
  showLabels?: boolean;
}

const Table: React.FC<DeploymentListProps> = ({
  data,
  columns,
  className,
  rowsPerPage = 5,
  onPageClick,
  totalData,
  showPagination = true,
  showLabels = true,
}) => {
  const generateGridColumns = useMemo(() => {
    return columns.map((column) => {
      if (["id", "actions"].includes(column.key)) {
        return "auto";
      }

      return "1fr";
    });
  }, [columns.length]);

  const getValue = (key: string, item: Data) => {
    const keys = key.split(".");
    let value: any = item;
    for (const k of keys) {
      value = value ? value[k] : undefined;
    }
    return value;
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="space-y-2 md:space-y-0 bg-white dark:bg-neutral-950 border border-neutral-200 text-neutral-950 shadow-sm dark:border-neutral-800 dark:text-neutral-50 rounded-lg divide-y divide-neutral-200 dark:divide-neutral-800">
        {!totalData && (
          <div className="flex justify-between items-center px-4 py-2">
            <p className="text-sm font-medium">
              {totalData} resultados encontrados
            </p>
          </div>
        )}

        {data.map((deployment, index) => (
          <div
            key={index}
            className={cn(
              "px-1 py-1.5 shadow-md flex flex-wrap [@media(min-width:840px)]:grid sm:gap-4",
              className
            )}
            style={{
              gridTemplateColumns: generateGridColumns.join(" "),
            }}
          >
            {columns.map((column, columnIndex) => {
              const renderSingleValue = getValue(column.key, deployment);
              const renderObject = renderSingleValue as {
                head: string;
                child: React.ReactNode;
                rules?: string;
              };
              const isReactNode = React.isValidElement(renderSingleValue);
              const showColumnLabel = showLabels && column.showLabel !== false;

              return (
                <div
                  key={columnIndex}
                  className={cn(
                    "w-full p-2",
                    "self-center",
                    // add border to every column
                    // "max-sm:[&:not(:last-child)]:border-b border-neutral-200 dark:border-neutral-800",
                    typeof renderSingleValue === "string" && "self-center",
                    isReactNode && "self-center",
                    // copy className
                    typeof renderSingleValue === "object" &&
                      React.isValidElement(renderSingleValue) &&
                      React.Children.count(renderSingleValue) === 1 &&
                      // @ts-ignore
                      React.Children.only(renderSingleValue).props?.className
                  )}
                >
                  {showColumnLabel && (
                    <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-400 mb-1">
                      {column.label}
                    </p>
                  )}
                  {isReactNode || typeof renderSingleValue !== "object" ? (
                    <>
                      {column.render ? (
                        <>
                          {column.render(
                            column.key === "actions"
                              ? deployment
                              : renderSingleValue
                          )}
                        </>
                      ) : (
                        <>
                          {typeof renderSingleValue !== "object" ? (
                            <p className="font-medium text-neutral-900 dark:text-neutral-50">
                              {column.modifyValue
                                ? column.modifyValue(renderSingleValue)
                                : renderSingleValue}
                            </p>
                          ) : (
                            <>
                              {column.modifyValue
                                ? column.modifyValue(renderSingleValue)
                                : renderSingleValue}
                            </>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <div
                      className={cn(
                        "flex flex-col justify-start items-stretch relative min-w-full",
                        renderObject.rules
                      )}
                    >
                      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                        {renderObject.head}
                      </p>
                      <p className="text-sm truncate text-neutral-700 dark:text-neutral-300">
                        {column.modifyValue
                          ? column.modifyValue(renderObject.child)
                          : renderObject.child}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* {showPagination && (
        <div className="self-end">
          <Pagination
            total={(totalData as number) ?? data.length}
            perPage={rowsPerPage}
            onPageClick={onPageClick as IPagination["onPageClick"]}
          />
        </div>
      )} */}
    </div>
  );
};

export default Table;
