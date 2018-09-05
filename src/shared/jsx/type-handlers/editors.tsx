import * as React from "react";
import {BooleanType, DatetimeType, EnumType, enumValuesMap, NumberType, TextType, Type, Types} from "../../model/types";
import {Checkbox, FormSelect, Icon, Input, Label} from "semantic-ui-react";
import ReactQuill from 'react-quill';
import {DropdownItemProps} from "semantic-ui-react/dist/commonjs/modules/Dropdown/DropdownItem"
import 'react-quill/dist/quill.snow.css';
import {empty, intToStr, strToInt} from "../../utils";
import {AttributeDisplay} from "../../views/display";
import {enumLabel} from "../utils/utils";
import {MessagesProps} from "../../i18n/messages";


interface ValueHandlerProps<T, TypeT extends Type<T>> extends MessagesProps {

    editMode: boolean;
    type: TypeT
    value:T;
    size ?: AttributeDisplay;

    // FIXME : this is a smell we may need to have two separate types for viewers and editors
    onValueChange? : (value:T) => void;
    [index:string] : any;
}


/** Generic wrapper hanlding transformation of internal state */
abstract class ControlledValueHandler<T, TypeT extends Type<T>> extends React.Component<ValueHandlerProps<T, TypeT>> {
    state : {
        innerValue:any,
        [key:string]: any};

    constructor(props: ValueHandlerProps<T, TypeT>) {
        super(props);
        this.state = {innerValue:this.toInnerValue(this.props.value)};
    }

    // By default record and inner record are the same
    extractValue(innerValue:any) : T {
        return innerValue as T;
    }

    toInnerValue(value:T) : any {
        // By default copy inner record
        return value;
    }

    onChange(newInnerValue:any) {
        this.setState({innerValue:newInnerValue});
        this.props.onValueChange && this.props.onValueChange(this.extractValue(newInnerValue));
    }

    render() {
        if (this.props.editMode) {
            return this.renderEdit();
        } else {
            return this.renderView();
        }
    }

    componentWillReceiveProps(nextProps : any) {
        if ("value" in nextProps && this.toInnerValue(this.props.value) != this.toInnerValue(nextProps.value)) {
            this.setState({innerValue:this.toInnerValue(nextProps.value)})
        }
    }

    abstract renderEdit() : JSX.Element | null | false;
    abstract renderView(): JSX.Element | null | false;
}


class BooleanHandler extends ControlledValueHandler<boolean, BooleanType>{

    renderEdit() {
        return <Checkbox
            checked={this.state.innerValue}
            onChange={ (e, data) => this.onChange(data.checked)}>
        </Checkbox>
    }
    renderView() {
        return <Icon
            name={this.state.innerValue ? "check" : "x"}
            color={this.state.innerValue ? "green" : "red"}/>
    }
}



class SimpleTextHandler extends ControlledValueHandler<string, TextType> {
    renderView() {
        return <span>{this.state.innerValue}</span>
    }
    renderEdit() {
        return <Input
            value={this.state.innerValue}
            onChange={(e, data) => this.onChange(data.value)} />;
    }
}

class DatetimeHandler extends ControlledValueHandler<Date, DatetimeType> {

    extractValue(innerValue:string) {
        if (empty(innerValue)) {
            return null;
        } else {
            return new Date(innerValue);
        }
    }

    toInnerValue(date:Date) {
        if (date == null) {
            return null;
        } else if (typeof(date) == "string") {
            // FIXME : For backward compatibility : should not happen
            return date;
        } else {
            return date.toISOString();
        }
    }

    renderView() {
        return <span>{this.state.innerValue}</span>
    }
    renderEdit() {
        return <Input
            value={this.state.innerValue}
            onChange={(e, data) => this.onChange(data.value)} />;
    }
}

class RichTextHandler extends ControlledValueHandler<string, TextType> {
    constructor(props: ValueHandlerProps<string, TextType>) {
        super(props);
        this.state.expanded = false;
    }

    toggleExpand =  () => {
        this.setState({expanded: !this.state.expanded});
    }

    renderEdit() {
        return <ReactQuill value={this.state.innerValue || ""}
                    onChange={(content, delta, source, editor) => this.onChange(editor.getHTML())} />
    }

    renderView() {

           /* let style = {overflowY:"hidden"} as any;
            if (!this.state.expanded) {
                style.maxHeight = "2em";
            } */


                /* <Button
                    icon={this.state.expanded ? "chevron up" : "chevron down"}
                    size="mini"
                    basic circular compact
                    style={{float:"right"}}
                    onClick={this.toggleExpand}/> */
        return    <div dangerouslySetInnerHTML={{__html: this.state.innerValue }} />

    }
}


class NumberHandler extends ControlledValueHandler<number, NumberType> {
    renderView() {
        return <span>{this.state.innerValue}</span>
    }
    extractValue(value:string) {
        return strToInt(value);
    }
    toInnerValue(value:number) {
        return intToStr(value);
    }
    renderEdit() {
        return <Input
            value={this.state.innerValue}
            type="number"
            onChange={(e, data) => this.onChange(data.value)} />;
    }
}

class EnumHandler extends ControlledValueHandler<string, EnumType> {
    renderView() {

        let {type, size, ...otherProps} = this.props;
        let _ = this.props.messages;

        let enumMap = enumValuesMap(type);
        let enumValue = enumMap[this.state.innerValue];
        let text = enumValue && enumValue.label ? enumValue.label : this.state.innerValue;

        let style = otherProps.style ? otherProps.style : {};
        if (enumValue && enumValue.color) {
            style = {...style, backgroundColor:enumValue.color};
        }
        return text ?
            <Label
                {...otherProps}
                style={style} >
                {text}
            </Label> :
            <Label ><i>
                {_.empty}
            </i></Label>;
    }
    renderEdit() {
        let valuesWithEmpty = [ {value:null}, ...this.props.type.values];
        let options = valuesWithEmpty.map(enumVal => ({
            text:enumLabel(enumVal),
            value:enumVal.value} as DropdownItemProps));

        return <FormSelect
            style={{zIndex:9999}}
            value={this.state.innerValue}
            options={options}
            onChange={(e, data) => this.onChange(data.value)} />
    }
}


/** Generic record handler, making the switch */
export const ValueHandler = (props: ValueHandlerProps<any, any>) => {
    switch(props.type.tag) {
        case Types.BOOLEAN :
            return <BooleanHandler {...props} />;
        case Types.TEXT :
            if (props.type.rich) {
                return <RichTextHandler {...props} />;
            } else {
                return <SimpleTextHandler {...props} />;
            }
        case Types.NUMBER :
            return <NumberHandler {...props} />;
        case Types.ENUM:
            return <EnumHandler {...props} />;
        case Types.DATETIME:
            return <DatetimeHandler {...props} />;
        default:
            throw new Error( `Type not supported : ${props.type.tag}`);
    }
}

