import React, { useEffect, useRef, useState } from 'react';
import { Circle, Group, Image, Layer, Line, Rect, Stage, Text, Transformer } from 'react-konva';

import { LabelingTool } from '../enums';
import { NewLabelDialog } from '../new-label-dialog';
import useLabelingStore from '../state';
import { handleStageMouseDown, handleStageMouseMove } from '../utils/add-label-helpers';
import {
  circleGroupBoundingBox,
  handleGroupDrag,
  handleShapeMouseDown,
  handleShapeTransform,
  handleVertexDragMove,
  rectGroupBoundingBox,
} from '../utils/transform-label-helpers';

import { FILL_COLOR, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT, MARKER_LENGTH, useStyles } from './styles';

interface LabelCanvas {
  imageURL: string;
}

export const LabelCanvas: React.FC<LabelCanvas> = ({ imageURL }) => {
  const classes = useStyles({});
  const layerItems = [];
  const imgRef = useRef(null);
  const stageContainerRef = useRef(null);
  const stageRef = useRef(null);
  const rectTransformerRef = useRef(null);
  const circleTransformerRef = useRef(null);
  const [newLabelDialogOpen, setNewLabelDialogOpen] = useState<boolean>(false);
  const [labelingState, labelingActions] = useLabelingStore<IL.LabelingState, IL.LabelingActions>();

  /**
   * Update cursor style when adding or transforming labels
   */
  const setCursorStyle = (cursor: string) => {
    stageContainerRef.current.style.cursor = cursor;
  };

  /**
   * Set the label name for the label and complete adding label
   */
  const handleNewLabelDialogCreate = (label: string) => {
    setNewLabelDialogOpen(false);
    labelingActions.setLabelBeingAdded({ ...labelingState.labelBeingAdded, label });
    labelingActions.setLabelComplete(true);
  };

  /**
   * Close new label dialog and remove the label being added from active labels
   */
  const handleNewLabelDialogCancel = () => {
    setNewLabelDialogOpen(false);
    labelingActions.setLabelComplete(false);
  };

  /**
   * Cleanup after completing new label
   */
  const completeAddingLabel = () => {
    setCursorStyle('default');
    setNewLabelDialogOpen(true);
  };

  /**
   * resize stage at component load
   */
  useEffect(() => {
    if (!labelingState.scaleFactor) {
      // scale stage and image to parent container
      const stageContainer = stageContainerRef.current;
      const img = imgRef.current;

      if (img.naturalWidth === 0 || img.naturalHeigh === 0) {
        return;
      }

      const widthScale = stageContainer.clientWidth / img.naturalWidth;
      const heightScale = stageContainer.clientHeight / img.naturalHeight;

      const imgScale = widthScale > heightScale ? heightScale : widthScale;
      const imgWidth = img.naturalWidth * imgScale;
      const imgHeight = img.naturalHeight * imgScale;
      labelingActions.setCanvasWidth(imgWidth);
      labelingActions.setCanvasHeight(imgHeight);

      img.style.width = imgWidth + 'px';
      img.style.height = imgHeight + 'px';

      const stage = stageRef.current;
      stage.width(imgWidth);
      stage.height(imgHeight);
      stage.draw();

      labelingActions.setScaleFactor(imgScale);
    }
  }, [labelingState.currentLabelSets]);

  /**
   * When the labeling tool changes add a new label to the active labels
   */
  useEffect(() => {
    if (labelingState.activeLabelingTool) {
      const labelID = -1 * Date.now();
      // user has selected a labeling tool so create a new label for the user to draw
      const newLabel: IL.Label = {
        id: labelID,
        label: 'New Label',
        probabilityScore: null,
        scope: labelingState.activeLabelingTool,
        geometryPoints: null,
        metadata: { newLabel: true },
      };
      labelingActions.setLabelBeingAdded(newLabel);

      if (labelingState.activeLabelingTool === LabelingTool.IMAGE) {
        // image(tag) labels are not draw so adding new image label is complete
        completeAddingLabel();
      }
    }
  }, [labelingState.activeLabelingTool]);

  /**
   * When the selected label changes remove the transformaer from the previous selected label
   * and add the tranformer to the curetly selected node
   */
  useEffect(() => {
    if (labelingState.selectedLabel) {
      if (labelingState.currentTransformer) {
        // remove node from previous transformer
        labelingState.currentTransformer.nodes([]);
      }

      let transformer;
      if (labelingState.selectedLabel.scope === LabelingTool.BOX) {
        transformer = rectTransformerRef.current;
      } else {
        transformer = circleTransformerRef.current;
      }

      const stage = transformer.getStage();
      const selectedNode = stage.findOne(`#${labelingState.selectedLabel.id}`);

      if (selectedNode) {
        // attach to node for selected label
        transformer.nodes([selectedNode]);
        labelingActions.setCurrentTransformer(transformer);
      }
    } else {
      if (labelingState.currentTransformer) {
        // remove node from previous transformer
        labelingState.currentTransformer.nodes([]);
      }
    }
  }, [labelingState.selectedLabel?.id]);

  /**
   * Reset the mouse cursor to default
   */
  const resetCursor = () => {
    setCursorStyle('default');
  };

  /**
   * Handle transformer updating a circle or rect shape
   *
   * @param e mouse event
   */
  const handleTransform = e => {
    labelingActions.setSelectedLabel(
      handleShapeTransform({
        e,
        selectedLabel: labelingState.selectedLabel,
        currentTransformer: labelingState.currentTransformer,
        canvasWidth: labelingState.canvasWidth,
        canvasHeight: labelingState.canvasHeight,
      })
    );
  };

  /**
   * Update cursor style when mouse is over a label or the stage
   */
  const handleMouseOver = () => {
    if (labelingState.labelBeingAdded) {
      setCursorStyle('crosshair');
    } else {
      setCursorStyle('move');
    }
  };

  /**
   * Set selected label when a user clicks a label
   *
   * @param e mouse event
   */
  const handleMouseDown = e => {
    labelingActions.setSelectedLabel(handleShapeMouseDown(e, labelingState.activeLabels));
  };

  /**
   * Update circle or square label group when dragged
   *
   * @param e mouse event
   */
  const handleDragMove = e => {
    setCursorStyle('move');
    labelingActions.setSelectedLabel(handleGroupDrag(e, labelingState.selectedLabel));
  };

  /**
   * Update point or polygon label when a vertex is dragged
   *
   * @param e mouse event
   */
  const handleVertexDrag = e => {
    if (!labelingState.labelBeingAdded) {
      setCursorStyle('move');
      labelingActions.setSelectedLabel(
        handleVertexDragMove({
          e,
          activeLabels: labelingState.activeLabels,
          canvasWidth: labelingState.canvasWidth,
          canvasHeight: labelingState.canvasHeight,
        })
      );
    }
  };

  /**
   * Get the bounding box function for a circle or rect shape
   *
   * @param pos position of the shape
   * @param label label to get bound function for
   * @returns bounding box function
   */
  const getDragBoundFunc = (pos, label) => {
    if (label.scope === LabelingTool.CIRCLE) {
      return circleGroupBoundingBox(
        {
          x: pos.x,
          y: pos.y,
          radius: label.geometryPoints[1][0] - label.geometryPoints[0][0],
        },
        labelingState.canvasWidth,
        labelingState.canvasHeight
      );
    } else {
      return rectGroupBoundingBox(
        {
          x: pos.x,
          y: pos.y,
          width: label.geometryPoints[1][0] - label.geometryPoints[0][0],
          height: label.geometryPoints[2][1] - label.geometryPoints[0][1],
        },
        labelingState.canvasWidth,
        labelingState.canvasHeight
      );
    }
  };

  /**
   * Create the text object to display with the label
   *
   * @param label label to create text llabel for
   * @param pos position of label text
   * @returns konva text object
   */
  const createLabelText = (label, pos) => {
    // set text offset from label shape
    const offset =
      label.scope === LabelingTool.CIRCLE ? label.geometryPoints[1][0] - label.geometryPoints[0][0] + 20 : 20;
    return (
      <Text
        offsetY={offset}
        x={pos.x}
        y={pos.y}
        text={label.label}
        name={`${label.scope}_Label__${label.id}`}
        fontFamily={FONT_FAMILY}
        fontSize={FONT_SIZE}
        lineHeight={LINE_HEIGHT}
        fill={labelingState.labelColor}
      />
    );
  };

  /**
   * Create the konva group for a circle or rect label
   *
   * @param text konva text for label
   * @param shape konva shape for label
   * @param label label being drawn
   * @retruns konva group object
   */
  const createShapeGroup = (text, shape, label) => {
    return (
      <Group
        x={label.geometryPoints[0][0]}
        y={label.geometryPoints[0][1]}
        key={`${label.scope}_Group_${label.id}`}
        id={`${label.scope}_Group_${label.id}`}
        name={`${label.scope}_Group_${label.id}`}
        draggable={true}
        onDragMove={handleDragMove}
        dragBoundFunc={pos => getDragBoundFunc(pos, label)}
      >
        {text}
        {shape}
      </Group>
    );
  };

  /**
   * Create the konva objects for the passed in rect label
   *
   * A label consist of a text label and the knova shape for the label
   * that are both added to a knova group so they are moved together
   *
   * @param label label to draw
   * @returns konva group object
   */
  const createRectLabel = label => {
    const boxLabelText = createLabelText(label, { x: 0, y: 0 });
    const rect = (
      <Rect
        x={0}
        y={0}
        width={label.geometryPoints[1][0] - label.geometryPoints[0][0]}
        height={label.geometryPoints[2][1] - label.geometryPoints[0][1]}
        scaleX={1}
        scaleY={1}
        stroke={labelingState.labelColor}
        strokeWidth={3}
        id={`${label.id}`}
        name={`${label.scope}_${label.id}`}
        onTransform={handleTransform}
        onMouseDown={handleMouseDown}
      />
    );

    return createShapeGroup(boxLabelText, rect, label);
  };

  /**
   * Create the konva objects for the passed in circle label
   *
   * A label consist of a text label and the knova shape for the label
   * that are both added to a knova group so they are moved together
   *
   * @param label label to draw
   * @returns konva group object
   */
  const createCircleLabel = label => {
    const circleLabelText = createLabelText(label, { x: 0, y: 0 });
    const circle = (
      <Circle
        x={0}
        y={0}
        radius={label.geometryPoints[1][0] - label.geometryPoints[0][0]}
        scaleX={1}
        scaleY={1}
        stroke={labelingState.labelColor}
        strokeWidth={3}
        id={`${label.id}`}
        name={`${label.scope}_${label.id}`}
        onTransform={handleTransform}
        onMouseDown={handleMouseDown}
      />
    );

    return createShapeGroup(circleLabelText, circle, label);
  };

  /**
   * Create the konva objects for the passed in point or polygon label
   *
   * A label consist of a text label and the knova shapes for the label
   * that are both added to a knova group so they are moved together
   *
   * @param label label to draw
   * @returns konva group object
   */
  const createPolygonLabel = label => {
    const verticesUI = [];
    const linePoints = [];

    const polyLabelText = createLabelText(label, {
      x: label.geometryPoints[0][0],
      y: label.geometryPoints[0][1],
    });

    let x, y;
    label.geometryPoints.forEach((v, i) => {
      x = v[0];
      y = v[1];

      verticesUI.push(
        <Rect
          offsetX={MARKER_LENGTH / 2}
          offsetY={MARKER_LENGTH / 2}
          x={x}
          y={y}
          key={`vertex_rect_${label.id}_${i}`}
          name={`vertex_rect_${label.id}_${i}`}
          fill={labelingState.labelColor}
          width={MARKER_LENGTH}
          height={MARKER_LENGTH}
          draggable
          dragOnTop={false}
          onMouseOver={handleMouseOver}
          onMouseOut={resetCursor}
          onDragMove={handleVertexDrag}
        />
      );
      linePoints.push(x);
      linePoints.push(y);
    });

    const lineUI = (
      <Line
        name={`Line_${label.id}`}
        points={linePoints}
        closed={true}
        fill={FILL_COLOR}
        stroke={labelingState.labelColor}
        strokeWidth={2}
        lineCap="round"
        lineJoin="round"
        onMouseOver={handleMouseOver}
        onMouseLeave={resetCursor}
        onMouseOut={resetCursor}
      />
    );

    return (
      <Group key={`${label.scope}_Group_${label.id}`} name={`${label.scope}_Group_${label.id}`}>
        {lineUI}
        {verticesUI}
        {polyLabelText}
      </Group>
    );
  };

  /**
   * Draw the active labels
   */
  labelingState.activeLabels?.forEach(label => {
    if (labelingState.finishedScaling === false || label.geometryPoints === null) {
      return;
    }

    switch (label.scope) {
      case LabelingTool.BOX: {
        layerItems.push(createRectLabel(label));
        break;
      }
      case LabelingTool.CIRCLE: {
        layerItems.push(createCircleLabel(label));
        break;
      }
      case LabelingTool.POINT:
      case LabelingTool.POLYGON: {
        layerItems.push(createPolygonLabel(label));
        break;
      }
      default: {
        return;
      }
    }
  });

  const stage = (
    <div ref={stageContainerRef} className={classes.stageContainer}>
      <img ref={imgRef} className={classes.image} src={imageURL} alt={imageURL} />
      <Stage
        ref={stageRef}
        className={classes.stage}
        onMouseOver={() => {
          if (labelingState.labelBeingAdded) {
            setCursorStyle('crosshair');
          } else {
            setCursorStyle('default');
          }
        }}
        onMouseDown={e => {
          if (labelingState.labelBeingAdded) {
            const { updatedLabel, labelComplete }: { updatedLabel: IL.Label; labelComplete: boolean } =
              handleStageMouseDown(e, labelingState.labelBeingAdded);
            labelingActions.setLabelBeingAdded(updatedLabel);
            if (labelComplete) {
              completeAddingLabel();
            }
          } else {
            // if the mouse down in not for a shape set selected label to null to clear any transfomers
            if (e.target.getClassName() === 'Image') {
              labelingActions.setSelectedLabel(null);
            }
          }
        }}
        onMouseMove={e => {
          if (labelingState.labelBeingAdded) {
            labelingActions.setLabelBeingAdded(handleStageMouseMove(e, labelingState.labelBeingAdded));
          }
        }}
        onMouseUp={e => {
          if (labelingState.labelBeingAdded) {
            if (
              labelingState.activeLabelingTool === LabelingTool.BOX ||
              labelingState.activeLabelingTool === LabelingTool.CIRCLE
            ) {
              // same update as mouse move but finish adding the label for mouse up
              const updatedLabel: IL.Label = handleStageMouseMove(e, labelingState.labelBeingAdded);
              labelingActions.setLabelBeingAdded(updatedLabel);
              completeAddingLabel();
            }
          }
        }}
        onMouseLeave={resetCursor}
        onMouseOut={resetCursor}
      >
        <Layer>
          <Image image={imgRef.current} />
        </Layer>
        <Layer>
          {layerItems}
          <Transformer
            ref={rectTransformerRef}
            rotateEnabled={false}
            enabledAnchors={[
              'top-left',
              'top-center',
              'top-right',
              'middle-right',
              'middle-left',
              'bottom-left',
              'bottom-center',
              'bottom-right',
            ]}
            anchorStroke={labelingState.labelColor}
            anchorSize={MARKER_LENGTH}
          />
          <Transformer
            ref={circleTransformerRef}
            rotateEnabled={false}
            enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
            anchorStroke={labelingState.labelColor}
            anchorSize={MARKER_LENGTH}
          />
        </Layer>
      </Stage>
    </div>
  );

  return (
    <div className={classes.root}>
      {stage}{' '}
      <NewLabelDialog
        open={newLabelDialogOpen}
        handleCreateLabel={handleNewLabelDialogCreate}
        handleCancelLabel={handleNewLabelDialogCancel}
      />
    </div>
  );
};
