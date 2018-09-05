/**
 *  Components showing extra parameters when editing schema attributes
 */
import {EnumType, EnumValue, TextType, Type, Types} from "../../../model/types";
import {_} from "../../../i18n/messages";
import {deepClone, slug} from "../../../utils";
import * as React from "react";
import {Button, Form, Header, Label} from "semantic-ui-react";
import {SafePopup} from "../../utils/ssr-safe";
import {SketchPicker} from "react-color";
import {EditableText} from "../../components/editable-text";


const DEFAULT_ENUM_COLOR="#e8e8e8";


interface TypeExtraProps<T extends Type<any>> {
    type: T;
    onUpdate: (newValue: T) => void;
    errorLabel : (key:string) => JSX.Element;
}

// Generic type for an extra attribute component
type TypeExtraComponent<T extends Type<any>> = React.SFC<TypeExtraProps<T>>;

const TextExtra: TypeExtraComponent<TextType> = (props) => {
    return <Form.Checkbox
        label={_.rich_edit}
        checked={props.type.rich}
        onChange={(e, val) => {
            let type = deepClone(props.type);
            type.rich = val.checked;
            props.onUpdate(type);
        }}/>
};
const EnumExtra: TypeExtraComponent<EnumType> = (props) => {

    // Local copy of type
    let type = deepClone(props.type);

    let editLabel = (label: string, index: number) => {
        type.values[index].label = label;

        // Sync slug name with label, if not already saved
        if (!type.values[index].saved) {
            type.values[index].value = slug(label);
        }
        props.onUpdate(type);
    };

    let editColor = (color: string, index: number) => {
        type.values[index].color = color;
        props.onUpdate(type);
    };

    let addOption = () => {
        let newOption : EnumValue = {value:null};
        type.values.push(newOption);
        props.onUpdate(type);
    };

    let deleteOption = (index:number) => {
        type.values.splice(index, 1);
        props.onUpdate(type);
    };



    return <div>

        <Header as="h4" >
            {_.enum_values}
            {props.errorLabel("values")}
        </Header>

        { /* Loop on enum values */
        type.values.map((enumVal, index) => {

        let color = enumVal.color || DEFAULT_ENUM_COLOR;
        return <div key={index}
                    style={{margin:"0.2em"}}
                    className="hoverable">
            <SafePopup trigger={
                <Label
                    title={_.edit_color}
                    circular size="tiny"
                    style={{
                        backgroundColor: color,
                        cursor:"pointer"}}>
                    &nbsp;&nbsp;
                </Label>}>
                <SketchPicker
                    color={color}
                    disableAlpha={true}
                    onChange={(color) => editColor(color.hex, index)}
                />
            </SafePopup>
            <EditableText
                placeholder={_.option_placeholder + " " + (index+1)}
                as={Label}
                value={enumVal.label}
                onChange={(val) => editLabel(val, index)}
                forceEdit={!enumVal.saved} />
            <Button
                size="mini"
                compact icon="close"
                className="super-shy"
                title={_.delete_option}
                onClick={() => deleteOption(index)}/>
            {props.errorLabel(`values.${index}.value`)}
            {props.errorLabel(`values.${index}.label`)}
            <br/>
        </div>
    })}

    <Button
        primary icon="add"
        size="small" compact
        onClick={addOption}>
        {_.add_option}
        </Button>

    </div>;
};


// Switch function providing extra panel based on attribute type
export function typeExtraSwitch(props: TypeExtraProps<any>) {
    if (props.type) switch (props.type.tag) {
        case Types.ENUM :
            return <EnumExtra {...props} />
        case Types.TEXT :
            return <TextExtra {...props} />
    }
    return null;
}