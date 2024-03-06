declare namespace ProdResources {
  // https://plentyag.atlassian.net/wiki/spaces/EN/pages/1259995221/Genealogy+API
  // https://plentyag.atlassian.net/browse/SD-10765#

  interface BaseResource<OperationType extends Operation> {
    /**
     * @description
     * The operations that occurred on resource. These are the operations
     * that will be displayed in the UI. When the maximum number of operations
     * is exceeded (maxOperations parameter), ellipsis will be displayed for overflow.
     */
    operations: OperationType[];

    /** @description If resource has parent then this returns parent resource */
    parent: ParentResource;

    /**
     * @description
     * If the maximum number of operations is exceeded and some operations to
     * the right (newer ops) are not displayed then this value will be the
     * number of operations not shown.
     */
    numberOfNewerOperationsNotShown: number;
    newestOperationNotShown: resourceState;

    /**
     * @description
     * If the maximum number of operations is exceeded and some operations to
     * the left (older ops) are not displayed then this value will be the
     * number of operations not shown.
     */
    numberOfOlderOperationsNotShown: number;
    oldestOperationNotShown: resourceState;

    /**
     * @description
     * True if the material in the resource is still active.
     * Ex: the resource might still have more operations in the future.
     */
    alive: boolean;
  }

  /**
   * @description
   * The resource for which we are viewing the genealogy,
   * it might have antecedent or subsequents.
   */
  type FocusedResource = BaseResource<FocusedOperation>;

  /**
   * @description
   * Parent of a antecedent, subsequent or focused resource.
   * Ex: Table is parent of a tray.
   */
  interface ParentResource extends BaseResource<Operation> {
    materialId: string;
  }

  /**
   * @description
   * Describes an operation on a subseqent, antecedent or focused resource.
   */
  interface Operation {
    id: string;

    /** @description Type of operation performed: Add Label, Remove Label, Tower Index, etc. */
    type: ProdActions.OperationTypes;

    /** @description User that performed operation. */
    username: string;

    /** @description date/time when operation was started. */
    startDt: string;
    /** @description Date/time when operation was completed. */
    endDt: string;

    machine: Machine;

    /** @description State before operation. */
    stateIn: ResourceState;

    /** @description State after operation. */
    stateOut: ResourceState;

    materialsCreated: string[];
    materialsConsumed: string[];
  }

  /**
   * @description
   * Operation occurring on the focused resource.
   * The operation might have either antecedents or subsequents or neither.
   */
  interface FocusedOperation extends Operation {
    /**
     * @description
     * For this operation, these antecedents created the focused resource.
     * Will be empty array if no antecedents exists for operation.
     * If focused item is container only then array will be empty. */
    antecedents: Antecedent[];

    /**
     * @description
     * For this operation, these subsequents consumed the focus resource.
     * Will be empty array if no subsequents exists for operation.
     * If focused item is container only then array will be empty. */
    subsequents: Subsequent[];
  }

  /**
   * @description
   * Resource the created the focused resource.
   * Ex: seed and media (antecedents) created tray with some material.
   */
  interface Antecedent extends BaseResource<Operation> {
    materialId: string;

    /** @description true if this antecedent in turn has antecedents */
    hasAntecedents: boolean;
  }

  /**
   * @description
   * Resource that consumed the focused resource.
   * Ex: tray (focused resource) is consumed into a
   * tower (subsequent) by transplanting operation.
   */
  interface Subsequent extends BaseResource<Operation> {
    materialId: string;

    /** @description True if this subsequent in turn has subsequents */
    hasSubsequents: boolean;
  }

  // D3 Related interface below here.
  type ChartRef = React.MutableRefObject<SVGSVGElement>;

  type Selection<T> = d3.Selection<T, any, any, any>;
  type XScale = d3.ScaleTime<number, number>;
  type YScale = d3.ScaleLinear<number, number>;

  interface Scale {
    xScale: XScale;
    yScale: YScale;
  }

  interface PathData {
    x: Date;
    y: number;
  }

  interface PathAttributes {
    stroke: string;
    fill: string;
    endMarker?: string;
    strokeWidth: number;
    strokeDashArray?: string;
  }

  interface ViewBounds {
    upperLeftX: number;
    upperLeftY: number;
    lowerRightX: number;
    lowerRightY: number;
  }
}
