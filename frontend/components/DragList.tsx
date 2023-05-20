import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Draggable, Droppable } from 'react-beautiful-dnd';

const ListOfCards: React.FC = () => {
  const [cards, setCards] = useState([
    { id: 'card1', text: 'Card 1' },
    { id: 'card2', text: 'Card 2' },
    { id: 'card3', text: 'Card 3' },
    { id: 'card4', text: 'Card 4' },
  ]);

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const newCards = [...cards];
    const [removed] = newCards.splice(result.source.index, 1);
    newCards.splice(result.destination.index, 0, removed);

    setCards(newCards);
  };

  return (
    <Droppable droppableId="cardList">
      {(provided: any) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {cards.map((card, index) => (
            <Draggable key={card.id} draggableId={card.id} index={index}>
              {(provided: any) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={{
                    userSelect: 'none',
                    margin: '0.5rem',
                    ...provided.draggableProps.style,
                  }}
                >
                  <Card>
                    <Card.Body>{card.text}</Card.Body>
                  </Card>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default ListOfCards;
